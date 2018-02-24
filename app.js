var express=require('express')
var port = process.env.PORT || 3000
var app = express()
var path = require('path')
var mongoose = require('mongoose')
var Movie=require('./models/movie')
var _ =require('underscore')

mongoose.connect('mongodb://localhost/imooc')
app.set('views','./views/pages')
app.set('view engine','jade')
app.use(require('body-parser').urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'bower_components')))
app.listen(port)

console.log('imooc started on port'+ port)

// index page
app.get('/', function(req, res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('index',{
            title: 'imooc 首页',
            movies: movies
        })
    })
})

// detail page
app.get('/movie/:id', function(req, res){
    var id= req.params.id
    Movie.fetch(id, function(err,movie){
        res.render('detail',{
            title: 'imooc' +movie.title,
            movie: movie

        })
    })

})


// admin page
app.get('/admin/movie', function(req, res){
    res.render('admin',{
        title: 'imooc 后台录入页',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
})
// admin post movie
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie

    if(id !=="undefind"){
        Movie.findById(id, function(err, movie){
            if(err){
                console.log(err)
            }
            _movie = _.extend(movie, movieObj)
            _movie.save(function(err, movie){
                if(err){
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    }else{
        _movie= new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster
        })
    }
})


// list page
app.get('/admin/list', function(req, res){
    res.render('list',{
        title: 'imooc 列表页',
        movies:[{
            title:'机械战警',
            _id:'1',
            doctor:'何塞·帕迪利亚',
            country:'美国',
            year:'2014',
            poster:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1517979999941&di=56f9cec66c86c91b5f4babeb2fa85a04&imgtype=0&src=http%3A%2F%2Fimg31.mtime.cn%2Fmg%2F2014%2F03%2F20%2F213325.16808283.jpg',
            language:'英语',
            flash:'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
        }]
    })
})

