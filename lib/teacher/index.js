'user strict'

var Teacher = require('./model')
var Materias = require('./materias')
var School = require("../auth/model")
var Subject = require('../subject/model')
var Estudiante = require("../students/model")
var Course = require('../course/model')
var Class = require('../class/model')

exports.clases_techer = function (req, res) {
    Class.find({ teacher:req.session.user, publish:false }).populate("teacher").populate("course")
    .then(function (clase) {
        res.json(clase)
      }, function (err) {
        return err
      })

}

exports.teacher = function(req, res){
  Course.find({ 'school':req.session.user.school }).populate('school').populate("course").populate("parallel").exec()
  .then(function(courses){

    Class.find({ teacher:req.session.user }).populate("teacher").populate("course")
    .populate("school").populate("subject").exec()
    .then(function(bitacoras){

        Materias.find({ teacher:req.session.user._id }).populate("materia")
        .then(function (materias) {
            res.render('teacher/teacher', {
                user:req.session.user, type:"Profesor", courses:courses,
                bitacoras:bitacoras, "materias":materias
            })
      }, function (err) {
        return err
      })
    }, function(err){
      return err.message
    })

  }, function(err){
    return err.message
  })
}

exports.addTeacher = function(req, res){
  Subject.find({ 'school':req.session.user }).populate('school').exec()
  .then(function(subjects){

    res.render('teacher/addteacher', { user:req.session.user, subjects:subjects,
        type:"Colegio", info_name:req.flash("info_name"), info_email:req.flash("info_email"), info_cedula:req.flash("info_cedula"), info_materias:req.flash("info_materias") })

  }, function(err){
    return err.message
  })
}

exports.postTeacher = function(req, res){
  var namePassword = req.body.name.toLocaleLowerCase().substring(0,3)
  var ciPassword = req.body.cedula.toString().substring(0,3)

  Promise.resolve(Teacher.findOne({ cedula: req.body.cedula }))
  .then(function(profe) {
      if(profe != null){
          req.flash("info_cedula", "Cedula ya exite")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Estudiante.findOne({ cedula:req.body.cedula }))
  })
  .then(function (teach) {
      if(teach != null){
          req.flash("info_cedula", "Cedula ya exite")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Teacher.findOne({ name: req.body.name.toUpperCase() }))
  })
  .then(function (profes) {
      if(profes != null){
          req.flash("info_name", "Nombre ya existe")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Estudiante.findOne({ email:req.body.email }))
  })
  .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(School.findOne({ email:req.body.email }))
  })
  .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect("/add/teacher")
      }
      else
        return Promise.resolve(Teacher.findOne({ email: req.body.email }))
  })
  .then(function (profeso) {
      if(profeso != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect("/add/teacher")
      }
      else if(req.body.subjects == undefined){
          req.flash("info_materias", "Debes selecionar materias")
          res.redirect("/add/teacher")
      }
      else{
          var mate = req.body.subjects
          var teacher = new Teacher({
            name: req.body.name.toUpperCase(),
            email: req.body.email,
            cedula: req.body.cedula,
            password: namePassword + ciPassword,
            school: req.session.user._id,
            subjects:mate,
            course:req.body.course,
            type:"Teacher"
          })

          mate.map(function (e, i) {
            var materias = Materias({
              teacher: teacher._id,
              materia: e
            })
            materias.save(function (err) {
              if(err) console.log(err)
              else console.log("Save complete...")
            })
          })

          if(req.files.avatar == undefined){
              teacher.avatar = "/media/mayor.jpg"

              teacher.save(function(err){
                  if(err) return err.message
                  else res.redirect("/school")
              })

          }
          else{
              var name = req.files.avatar.name
              var spl_name = name.split(" ")
              var image_file = spl_name.join("_")

              teacher.avatar = `/imagen/${image_file}`

              teacher.save(function(err){
                  if(err) return err.message
                  else res.redirect("/school")
              })
          }

      }
  })
  .catch(function (err) {
      return err.message
  })

}

exports.editar = function (req, res) {
    var id = req.params.id

    Teacher.findById(id)
    .then(function (profesor) {

        Subject.find({ 'school':req.session.user }).populate('school')
        .then(function(subjects){

          res.render('teacher/edit', {
            user:req.session.user, subjects:subjects, type:"Colegio", profesor:profesor,
            info_name:req.flash("info_name"), info_email:req.flash("info_email"), info_materias:req.flash("info_materias") })
        },
        function(err){
          return err.message
        })
    },
    function(err) {
        return err.message
    })
}

exports.edit = function (req, res) {
    var id = req.params.id

    Promise.resolve(Estudiante.findOne({ email:req.body.email }))
    .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else
        return Promise.resolve(School.findOne({ email:req.body.email }))
    })
    .then(function (profesor) {
      if(profesor != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else
        return Promise.resolve(Teacher.findOne({ email: req.body.email }))
    })
    .then(function (profeso) {
      if(profeso != null){
          req.flash("info_email", "E-mail ya existe")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else if(req.body.subjects == undefined){
          req.flash("info_materias", "Debes selecionar materias")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else if(typeof(req.body.subjects) == "string"){
          req.flash("info_materias", "Debes selecionar 2 materias")
          res.redirect(`/profesor/editar/${ id }`)
      }
      else{
          Teacher.findById(id)
          .then(function (profesor) {
              var mater = req.body.subjects
              profesor.name = req.body.name
              profesor.email = req.body.email
              profesor.subjects = req.body.subjects

              Materias.find({ teacher:profesor._id })
              .then(function (materia) {

                materia.map(function (ma) {
                  ma.remove(function (err) {
                    if(err) return err
                  })
                })

                mater.map(function (e, i) {
                  var materias = Materias({
                    teacher: profesor._id,
                    materia: e
                  })
                  materias.save(function (err) {
                    if(err) console.log(err)
                    else console.log("Save complete...")
                  })
                })

                profesor.save(function (err) {
                    if(err) return err.message
                    else res.redirect("/school")
                })

              },
              function (err) {
                return err
              })
          },
          function(err) {
              return err.message
          })

      }
    })
    .catch(function (err) {
        return err.message
    })

}
