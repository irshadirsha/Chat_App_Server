const express = require ('express')

const registerUser = require ('../controller/registerUser')
const checkEmail = require('../controller/checkEmial')
const checkPassword = require('../controller/checkPassword')
const logOut = require('../controller/logOut')
const updateUserDetails = require('../controller/userUpdateDetails')
const userDetail = require('../controller/userDetail')
const SearchUser = require('../controller/searchUser')


const router = express.Router()

router.post('/register',registerUser)

router.post('/email',checkEmail)

router.post('/password',checkPassword)

router.get('/user-details',userDetail)     

router.get('/logout',logOut)

router.post('/update-user',updateUserDetails)

router.post('/search-user',SearchUser)

module.exports=router