import { getRepository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Role } from '../model/index';
import messages from '../messageResponse.js'

class RoleService {
  //GET_ALL
  async getAll(_, res) {
    const result = await AppDataSource.getRepository(Role).find();
    return res.send(result);
  }

  //CREATE
  async create(req, res) {
    const roleRepo = await AppDataSource.getRepository(Role);
      const {roleName} = req.body;
      if (!roleName) {
        return res.status(400).json({
          code: 400,
          message: messages.missingRoleName,
        });
      }

      const existRoleName = await roleRepo.findOne({
        where: { roleName: roleName },
      });
      if (existRoleName) {
        return res.status(400).json({
          code: 400,
          message: messages.roleExists,
        });
      }
      const role = new Role();
      role.roleName = roleName;
      roleRepo.save(role);
			res.send(200, 'Create success')
    
  }
}

export default new RoleService();
