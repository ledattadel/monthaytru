export  function changeRoleFromEnToVi(roleName) {
    if (roleName === 'technician') {
       return 'Kĩ thuật viên' 
    } else if (roleName === 'manage') {
        return 'Quản lý' 
    } else if(roleName=== 'admin'){
        return 'Quản trị viên'
    }
  }
  


  export  function changeRoleFromViToEn(roleName) {
    if (roleName === 'Kĩ thuật viên') {
       return 'technician' 
    } else if (roleName=== 'Quản lý') {
        return 'manage' 
    } else if(roleName === 'Quản trị viên'){
        return 'admin'
    }
  }
  