const router = require('express').Router()
const {all} = require('../middleware/auth')
const {
  all_salaries,
  create_salary,
  get_salary,
  edit_salary,
  delete_salary
} = require('../controllers/salary')


router.get('/', all, all_salaries)
router.post('/', all, create_salary)
router.get('/:id', all, get_salary)
router.put('/', all, edit_salary)
router.delete('/:id', all, delete_salary)


module.exports = router
