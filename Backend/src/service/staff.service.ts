import { AppDataSource } from '../data-source';
import { Staff, Role } from '../model';
import { isEmptyObject, error, success } from '../util';
import messages from '../messageResponse.js'
import jwt = require('jsonwebtoken');

class StaffService {
  async getAllUser(_, res) {
    const result = AppDataSource.getRepository(Staff)
    const roleRepository = AppDataSource.getRepository(Role)
    const staffs =  await result.find({
      where: { isActive: true }
    });
    let renderStaffs = await Promise.all(staffs.map(async (staff)=>{
      let role = await roleRepository.findOne({where:{roleId: Number(staff.RoleId)}});
      return {
        ...staff,
        Role:role?.roleName
      }
    }))
    
    return res.send(renderStaffs);
  }
  
  async getUsersByRole(roleName, _, res) {
    const result = await AppDataSource.getRepository(Staff).find({
      relations: ['role'],
      where: {
        isActive: true,
        role: {
          roleName: roleName
        }
      }
    });
    return res.send(result);
  }
  
  async getAllManage(_, res) {
    const result = await AppDataSource.getRepository(Staff).find({
      relations: ['role'],
      where: {
        isActive: true,
        role: {
          roleName: "manage"
        }
      }
    });
    return res.send(result);
  }
  
  async getAllTechnicians(_, res) {
    const result = await AppDataSource.getRepository(Staff).find({
      relations: ['role'],
      where: {
        isActive: true,
        role: {
          roleName: "technician"
        }
      }
    });
    return res.send(result);
  }
  
  
//   //sign in
  async signIn(req, res) {
    if (isEmptyObject(req.body)) {
      return error({
        res,
        message: 'Empty data',
      });
    }

    const { username, password } = req.body;

    if (!password && !username) {
      return error({
        res,
        message: messages.userNotInputUsernamePassword,
      });
    }
    if (!username) {
      return error({
        res,
        message: messages.userNotInputUsername,
      });
    }
    if (!password) {
      return error({
        res,
        message: messages.userNotInputPassword,
      });
    }
    if (password.length <6 || password.length >32) {
      return error({
        res,
        message: messages.wrongLengthPasswordWhenSignIn,
      });
    }
    

    const account = await AppDataSource.getRepository(Staff).findOne({
      where: {
        username,
      },
    });
    if (!account) {
      return error({
        res,
        message: messages.accountNotFoundWhenSignIn,
      });
    }
    const validPassword = account.comparePassword(password);
    if (!validPassword) {
      return error({
        res,
        message: messages.wrongPasswordWhenSignIn,
      });
    }
    const staff = await AppDataSource.getRepository(Staff).findOne({
        where: { username },
        relations: ['role'], 
    });
    let roleName = null;
    if (staff) {
         roleName = staff.role.roleName;
    }
    const accessToken = jwt.sign(
		{  username, roleName },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: '1h'
		}
	)



  // return res.status(200).json({
  //   username:staff.username ,
  //   address:staff.address, 
  //   idCardNumber:staff.idCardNumber, 
  //   dob:staff.dob,
  //   name:staff.name, 
  //   email:staff.email, 
  //   phoneNumber:staff.phoneNumber, 
  //   role:staff.role 
  // });
   
    return success({
      res,
      message: { accessToken: accessToken },
    });
  }
      
   
  // sign up
  async createStaff(req, res) {
    if (isEmptyObject(req.body)) {
        return error({
        res,
        message: messages.badRequest,
      });
    }
    const {
      username,
      password,
      dob,
      idCardNumber,
      name,
      address,
      email,
      phoneNumber,
      roleName,
      
    } = req.body;


    const missingFields = [];

    if (!username) missingFields.push("username");
    if (!idCardNumber) missingFields.push("idCardNumber");
    if (!password) missingFields.push("password");
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!phoneNumber) missingFields.push("phoneNumber");
    if (!roleName) missingFields.push("roleName");
  
    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 400,
        message: messages.badRequest + ` Thiếu field : ${missingFields.join(", ")}`,
      });
    }

    const staffRepo = await AppDataSource.getRepository(Staff);
    
    const existEmail = await staffRepo.findOne({
        where: { email: email },
      });

    const existUsername = await staffRepo.findOne({
      where: { username: username },
    });
    const existIdCardNumber = await staffRepo.findOne({
      where: { idCardNumber: idCardNumber },
    });

    if (existEmail) {
        return res.status(400).json({
          code: 400,
          message: messages.emailExists,
        });
      }
      
      if (existUsername) {
        return res.status(400).json({
          code: 400,
          message: messages.accountExists,
        });
      }
      
      if (existIdCardNumber) {
        return res.status(400).json({
          code: 400,
          message: messages.idCardExists,
        });
      }
      

    const role = await AppDataSource.getRepository(Role).findOne({
      where: { roleName: roleName },
    });
    if (!role) {
        return res.status(400).json({
            code: 400,
            message: messages.roleNameNotExist,
          });
    }
   
    //create account relate user
    const staff = new Staff();
    staff.username = username;
    staff.password = staff.createPassword(password);
    staff.address = address || null;
    staff.idCardNumber = idCardNumber
    staff.name = name;
    staff.email = email;
    staff.phoneNumber = phoneNumber;
    staff.role = role;
    staff.isActive = true;

    await staffRepo.save(staff);

    return res.status(200).json({
      code: 200,
      message: messages.createStaffSuccessful,
    });
  }

  async getRoleNameByUsername(req, res){
    const username = req.params.username; 

    try {
      const staffRepository =  AppDataSource.getRepository(Staff);
      const staff = await staffRepository.findOne({
        where: { username },
        relations: ['role'], 
      });
  
      if (staff) {

        const roleName = staff.role.roleName;
        return res.json({ roleName });
      } else {
        return res.status(404).json({ error: messages.notFound });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async updateStaff(req, res) {
    const staffId = req.params.staffId; 
  
    if (!staffId) {
      return res.status(400).json({
        code: 400,
        message: messages.missingStaffIDWhenUpdate,
      });
    }
  
    const staffRepo = AppDataSource.getRepository(Staff);
  
    const staff = await staffRepo.findOne({
      where: { id: staffId },
    });
  
    if (!staff) {
      return res.status(404).json({
        code: 404,
        message: messages.notFound,
      });
    }
  
    const {
      username,
      password,
      dob,
      idCardNumber,
      name,
      address,
      email,
      phoneNumber,
      roleName,
    } = req.body;
  
   
    
    if (username) {
      staff.username = username;
    }
  
    if (password) {
      staff.password = staff.createPassword(password);
    }else if(password === ''){
      staff.password = staff.password;
    }

    if (idCardNumber) {
      staff.idCardNumber = idCardNumber;
    }
  
    if (name) {
      staff.name = name;
    }
  
    if (address) {
      staff.address = address;
    }
  
    if (email) {
      staff.email = email;
    }
  
    if (phoneNumber) {
      staff.phoneNumber = phoneNumber;
    }
  
    if (roleName) {
      const role = await AppDataSource.getRepository(Role).findOne({
        where: { roleName: roleName },
      });
  
      if (!role) {
        return res.status(400).json({
          code: 400,
          message: messages.roleNameNotExist,
        });
      }
  
      staff.role = role;
    }
  
    await staffRepo.save(staff);
  
    return res.status(200).json({
      message: messages.updateStaffSuccessful,
    });
  }
  async getUserInfor(req, res){
    const staffRepo = AppDataSource.getRepository(Staff);
    const roleRepo = AppDataSource.getRepository(Role)

  
    const staff = await staffRepo.findOne({
      where: { username: req.params.username },
    });
  
    let role = await roleRepo.findOne({where:{roleId: Number(staff.RoleId)}});

    return res.status(200).json({
      userId:staff.id ,
      username:staff.username ,
      address:staff.address, 
      idCardNumber:staff.idCardNumber, 
      name:staff.name, 
      email:staff.email, 
      phoneNumber:staff.phoneNumber, 
      role:role.roleName 
    });
  }

  async deleteStaff(req, res) {
    const staffId = req.params.staffId; 
  
    if (!staffId) {
      return res.status(400).json({
        code: 400,
        message: messages.missingStaffIDWhenUpdate,
      });
    }
  
    const staffRepo = AppDataSource.getRepository(Staff);
  
    const staff = await staffRepo.findOne({
      where: { id: staffId,  isActive: true },
    });
  
    if (!staff) {
      return res.status(404).json({
        code: 404,
        message: messages.notFound,
      });
    }
  
    staff.isActive = false;

    await staffRepo.save(staff);
  
    return res.status(200).json({
      message: messages.deleteStaffSuccessful,
    });
  }
  
}

export default new StaffService();
