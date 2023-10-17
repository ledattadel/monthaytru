import { Request, Response, NextFunction } from 'express';
import {verify} from 'jsonwebtoken';
import messages from '../messageResponse.js'

export  function authenticateJwt(req, res, next) {
    const authHeader = req.header('Authorization')

    if (!authHeader) {
      return res.status(401).json({ error:messages.missingToken });
    }
  
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
  

	const token = authHeader && authHeader.split(' ')[1]
    try {
      console.log({token:token, secretKey: secretKey});  
      const decoded = verify(token, secretKey);
 
      req.username = decoded.username;
      req.role=decoded.roleName
      next();
    } catch (err) {
      return res.status(401).json({ error: messages.invalidToken });
    }
}


export  function checkAdminRole(req, res, next) {
    if (!req.username) {
      return res.status(401).json({ error: messages.UnauthorizedUser });
    }
  
    if (req.role !== 'admin') {
      return res.status(403).json({ error: messages.notAdminRole });
    }
  
    next();
  }
  

  
export  function checkTechnicianRole(req, res, next) {
    if (!req.username) {
      return res.status(401).json({ error: messages.UnauthorizedUser });
    }
  
    if (req.role !== 'technician') {
      return res.status(403).json({ error: messages.notTechnicianRole });
    }
  
    next();
  }
  

  export  function checkManageRole(req, res, next) {
    if (!req.username) {
      return res.status(401).json({ error:  messages.UnauthorizedUser  });
    }
  
    if (req.role !== 'manage') {
      return res.status(403).json({ error: messages.notManageRole });
    }
  
    next();
  }
  

  export  function checkManageAndAdminRole(req, res, next) {
    if (!req.username) {
      return res.status(401).json({ error:  messages.UnauthorizedUser });
    }
    console.log(req.role)
    if (req.role !== 'manage' && req.role !== 'admin') {
      return res.status(403).json({ error: messages.notAdminOrManageRole });
    }
  

    next();
  }
  