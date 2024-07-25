const axios = require('axios');
const knex = require('../database')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { getHashedPassword, comparePassword, createToken } = require('../helpers/useful')

async function validateHuman(token){
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`)
    return response.data.success;
  }

module.exports = {
    
    async register(req, res, next) {
        try {
            if(!req.body) {
                return res.status(400).send({error: 'nenhum parâmetro informado'})
            }

            const newUser  = req.body;
            console.log(req.body);

            // validação da senha e email WIP
            if(!newUser.password) {
                return res.status(400).send({error: 'Senha não informada'})
            }

            if(!newUser.email) {
                return res.status(400).send({error: 'Email não informado'})
            }

            const checkUser = await knex('users').where('email', newUser.email).first()

            if(checkUser) {
                return res.status(400).send({error: 'Usuário já existe'})
            }

            const hashPassword = await bcrypt.hash(newUser.password, 10)
            newUser.password = hashPassword;

                try {
                    await knex('users').insert({   
                            email : newUser.email,
                            password: hashPassword,
                            name: newUser.name
                        })

                    var user = await knex('users').where('email', newUser.email).first()
                    
                    user.token = jwt.sign({ data: user.id }, process.env.JWT_SECRET);
                    
                    user.password = undefined
                    return res.json({user: user})

                } catch (error) {
                    next(error)
                }
        }
        catch (error) {
            next(error)
        }
        
    },    
    async userRegister(req, res, next) {
        try {
            if(!req.body) {
                return res.status(400).send({error: 'nenhum parâmetro informado'})
            }

            const newUser  = req.body;
            console.log(req.body);

            // validação captcha

            const human = await validateHuman(newUser.token);
            if (!human) {
              res.status(400);
              res.json({ errors: ["Erro ao acessar captcha."] });
              return;
            }

            // validação da senha e email WIP
            if(!newUser.password) {
                return res.status(400).send({error: 'Senha não informada'})
            }

            if(!newUser.email) {
                return res.status(400).send({error: 'Email não informado'})
            }

            const email = newUser.email.toLowerCase();

            const checkUser = await knex('users').where('email', email).first()

            if(checkUser) {
                return res.status(400).send({error: 'Usuário já existe'})
            }

            const hashPassword = await bcrypt.hash(newUser.password, 10)
            newUser.password = hashPassword;

                try {
                    await knex('users').insert({   
                            email : email,
                            password: hashPassword,
                            name: newUser.name
                        })

                    var user = await knex('users').where('email', email).first()
                    
                    user.token = jwt.sign({ data: user.id }, process.env.JWT_SECRET);
                    
                    user.password = undefined
                    return res.json({user: user})

                } catch (error) {
                    next(error)
                }
        }
        catch (error) {
            next(error)
        }
        
    },    

    async login(req, res, next) {
        try {
            var { email, password } = req.body

            if(!email || !password) {
                return res.status(400).send({error: 'Email ou senha não informados'})
            }

            email = email.toLowerCase();
            const user = await knex('users').where('email', email).first()

            if(!user) {
                return res.status(400).send({error: 'Usuário não encontrado'})
            }

            if (!await bcrypt.compare(password, user.password)) {
                return res.status(400).send({error: 'Senha inválida'})
            }

            token = jwt.sign({ data: user.id }, process.env.JWT_SECRET, {
                expiresIn: 86400
            });
                        
            user.password = undefined
            return res.json({user, token})
            
        } catch(error) {
            next(error)
        }
    }
    
}