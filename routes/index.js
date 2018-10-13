var express = require('express');
var router = express.Router();
var fn_exc = require('./../fn_exc');

/* GET home page. */
router.get('/', function(req, res, next) {
    fn_exc.exc({
        c: 'users',
        w: {},
        m: 's'
    }, function(obj) {
        res.render('index',
          {
            title: 'Express',
            test: 'abcprintf',
            data_arrys: obj
          }
        );
    });
});

router.get('/create', function(req, res) {
    res.render('create',
        {
            title: 'Create'
        }
    );
});

router.post('/create', function(req, res) {
    fn_exc.exc({
        c: 'users',
        w: req.body,
        m: 'i'
    }, function(obj) {
        if (obj.status) {
            res.redirect('/');
        }
    });
});

router.get('/edit/:id', (req, res) => {
    fn_exc.exc({
        c: 'users',
        v: req.params.id,
        m: 'sObjId'
    }, function(obj) {
        res.render('edit',
            {
                title: 'Edit',
                data: obj
            }
        );
    });
});

router.post('/edit', (req, res) => {
    fn_exc.exc({
        c: 'users',
        v: req.body.id,
        w: {
            username: req.body.username,
            email: req.body.email,
            mobile: req.body.mobile
        },
        m: 'uObjId'
    }, (obj) => {
        if(obj.status){
            res.redirect('/');
        }
    });
});

module.exports = router;
