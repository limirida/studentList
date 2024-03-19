// Этап 1. В HTML файле создайте верстку элементов, которые будут статичны(неизменны).

// Этап 2. Создайте массив объектов студентов.Добавьте в него объекты студентов, например 5 студентов.
const SERVER_URL = 'http://localhost:3000'

async function serverAddSudent(obj) {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })

  let data = await response.json()

  return data
}

async function serverGetSudent() {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }
  })

  let data = await response.json()

  return data
}

async function serverDeleteSudent(id) {
  let response = await fetch(SERVER_URL + '/api/students/' + id, {
    method: "DELETE",
  })

  let data = await response.json()

  return data
}

let serverData = await serverGetSudent()

let studentsList = [

  // Добавьте сюда объекты студентов
  // {
  //   name: 'Ольга',
  //   lastname: 'Дьяченко',
  //   surname: 'Викторовна',
  //   birthday: new Date(1994, 8, 12),
  //   faculty: 'Филология',
  //   studyStart: '2012',

  // },
  // {
  //   name: 'Артем',
  //   lastname: 'Бондаренко',
  //   surname: 'Олегович',
  //   birthday: new Date(1996, 7, 16),
  //   faculty: 'Экономика',
  //   studyStart: '2019',

  // },
  // {
  //   name: 'Дмитрий',
  //   lastname: 'Коваленко',
  //   surname: 'Александрович',
  //   birthday: new Date(1995, 2, 3),
  //   faculty: 'Ветеринария',
  //   studyStart: '2023',

  // }
]
if (serverData) {
  studentsList = serverData
}

const copystudentsList = [...studentsList]

const fioSort = document.getElementById('fio-sort')
const ageSort = document.getElementById('age-sort')
const facultySort = document.getElementById('faculty-sort')
const studyStartSort = document.getElementById('studyStart-sort')
let today = new Date();

let sortColumnFlag = 'fio',
  sortDirFlag = true

function formatDate(date) {
  let dd = date.getDate();
  dd < 10 ? dd = '0' + dd : '';

  let mm = date.getMonth() + 1;
  mm < 10 ? mm = '0' + mm : '';

  let yy = date.getFullYear();
  yy < 10 ? yy = '0' + yy : '';

  return dd + '.' + mm + '.' + yy;
}
// Создание Tr одного пользователя

function getNewStudentTr(oneUser) {
  const tr = document.createElement('tr')
  const tdFIO = document.createElement('td')
  const tdBirthday = document.createElement('td')
  const tdFaculty = document.createElement('td')
  const tdstudyStart = document.createElement('td')
  const tdDelete = document.createElement('td')
  const btnDelete = document.createElement('button')
  btnDelete.classList.add('btn', 'btn-danger', 'w-100',)
  btnDelete.textContent = 'Удалить'

  //сколько лет студенту
  // let birthday = oneUser.birthday;
  let birthday = new Date(oneUser.birthday)
  // let birthday = formatDate(new Date(oneUser.birthday))

  let ageStudent = today.getFullYear() - birthday.getFullYear()
  //курс студента

  function formatEducationDate(oneUser) {
    let todayYear = today.getFullYear()
    let studyStartEducation = oneUser.studyStart
    let endEducation = parseInt(oneUser.studyStart) + 4
    let courceNum = '';

    if (today > new Date(endEducation, 8, 1)) {
      courceNum = 'Закончил/a'
    } else {
      courceNum = `${todayYear - studyStartEducation} курс`
    }
    let educationInfo = `(${oneUser.studyStart} - ${endEducation}  ${courceNum})`
    return educationInfo

  }

  tdFIO.textContent = oneUser.fio = oneUser.name + ' ' + oneUser.surname + ' ' + oneUser.lastname
  tdBirthday.textContent = `${formatDate(new Date(oneUser.birthday))} ` + `(${ageStudent}` + ` лет)`
  tdFaculty.textContent = oneUser.faculty
  tdstudyStart.textContent = oneUser.studyStart + `${formatEducationDate(oneUser)} `
  tdDelete.append(btnDelete)


  btnDelete.addEventListener('click', async function () {
    await serverDeleteSudent(oneUser.id)
    tr.remove()

  })

  tr.append(tdFIO, tdBirthday, tdFaculty, tdstudyStart, btnDelete)
  return tr

}



//Фильтрация
function filter(arr, prop, value) {
  let result = []
  let copy = [...arr]
  for (const item of copy) {
    if (String(item[prop]).toLowerCase().includes(value) == true) result.push(item)
  }
  return result
}

// console.log(copy)

//render
function render(arr) {

  const studTable = document.getElementById('stud-table')
  studTable.innerHTML = ''
  let copyArr = [...arr]
  //Подготовка
  for (const oneUser of copystudentsList) {

    oneUser.fio = oneUser.name + ' ' + oneUser.surname + ' ' + oneUser.lastname
    // console.log(((new Date(oneUser.birthday).getFullYear())))
    // console.log(birthday.getFullYear)
    oneUser.age = today.getFullYear() - (new Date(oneUser.birthday)).getFullYear()
    oneUser.end = parseInt(oneUser.studyStart) + 4
  }


  const fioFiltr = document.getElementById('fioFiltr').value.trim().toLowerCase()
  const facultyFilt = document.getElementById('facultyFilt').value.trim().toLowerCase()
  const studyStartFilt = document.getElementById('studyStartFilt').value.trim().toLowerCase()
  const endFilt = document.getElementById('endFilt').value.trim().toLowerCase()


  if (fioFiltr !== '') copyArr = filter(copyArr, 'fio', fioFiltr)
  if (facultyFilt !== '') copyArr = filter(copyArr, 'faculty', facultyFilt)
  if (studyStartFilt !== '') copyArr = filter(copyArr, 'studyStart', studyStartFilt)
  if (endFilt !== '') copyArr = filter(copyArr, 'end', endFilt)



  ////сортировка
  copyArr = copyArr.sort(function (a, b) {
    let sort = a[sortColumnFlag] < b[sortColumnFlag]
    console.log(sortColumnFlag)
    if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag]
    if (sort) return -1
  })


  //ОТРИСОВКА

  for (const oneUser of copyArr) {
    const newTr = getNewStudentTr(oneUser)
    studTable.append(newTr)
  }
}
render(studentsList)

//
document.getElementById('filter-form').addEventListener('submit', function (event) {
  event.preventDefault()

})

fioFiltr.addEventListener('input', function () {
  render(studentsList)
})
facultyFilt.addEventListener('input', function () {
  render(studentsList)
})
studyStartFilt.addEventListener('input', function () {
  render(studentsList)
})
endFilt.addEventListener('input', function () {
  render(studentsList)
})



///валидация формы

function validation(form) {
  function removeError(input) {
    const parent = input.parentNode
    if (parent.classList.contains('error')) {
      parent.querySelector('.error-label').remove()
      parent.classList.remove('error')
    }
  }

  function createError(input, text) {
    const parent = input.parentNode
    const errorLabel = document.createElement('label')
    errorLabel.classList.add('error-label')
    errorLabel.textContent = text

    parent.classList.add('error')
    parent.append(errorLabel)
  }

  let result = true
  const allInputs = form.querySelectorAll('input')

  const birthdayForm = document.getElementById('birthday-inp')
  const studyStartForm = document.getElementById('studyStart-inp')

  for (const input of allInputs) {
    removeError(input)
    if (input.value == "") {
      console.log('Ошибка поля')
      createError(input, 'Поле не заполненно!')
      result = false
    } else {
      if ((birthdayForm.value.trim() !== "") && (birthdayForm.value.trim() < '1990-01-01')) {
        console.log('Ошибка поля')
        removeError(birthdayForm)
        createError(birthdayForm, 'Дата не ранее 1990г')
        result = false
      }
      if ((studyStartForm.value.trim() !== "") && (parseInt(studyStartForm.value.trim()) < '2000')) {
        console.log('Ошибка поля')
        removeError(studyStartForm)
        createError(studyStartForm, 'Дата не ранее 2000г')
        result = false
      }
    }
  }
  return result
}

document.getElementById('add-form').addEventListener('submit', async function (event) {
  event.preventDefault()
  if (validation(this) == true) {
    alert('Форма проверена успешно!')
    let newStudentObj = {
      name: document.getElementById('name-inp').value.trim(),
      lastname: document.getElementById('lastname-inp').value.trim(),
      surname: document.getElementById('surname-inp').value.trim(),
      birthday: new Date(document.getElementById('birthday-inp').value.trim()),
      faculty: document.getElementById('faculty-inp').value.trim(),
      studyStart: document.getElementById('studyStart-inp').value.trim(),
    }

    let serverDataObj = await serverAddSudent(newStudentObj)
    console.log(serverDataObj);

    serverDataObj.birthday = new Date(serverDataObj.birthday)

    studentsList.push(serverDataObj)
    render(studentsList)
    document.getElementById('add-form').reset()
  }
})


//клики сортировки
fioSort.addEventListener('click', function () {
  sortColumnFlag = 'fio'
  sortDirFlag = !sortDirFlag
  render(studentsList)
})
ageSort.addEventListener('click', function () {
  sortColumnFlag = 'age'
  sortDirFlag = !sortDirFlag
  render(studentsList)
})
facultySort.addEventListener('click', function () {
  sortColumnFlag = 'faculty'
  sortDirFlag = !sortDirFlag
  render(studentsList)
})
studyStartSort.addEventListener('click', function () {
  sortColumnFlag = 'studyStart'
  sortDirFlag = !sortDirFlag
  render(studentsList)
})
