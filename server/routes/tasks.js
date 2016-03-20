var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

if(process.env.DATABASE_URL) {//connecting to outside heroku database
    pg.defaults.ssl = true;
    connectionString = process.env.DATABASE_URL;
} else{//connecting to local database before being connected to heroku for testing purposes
    connectionString = 'postgress://localhost:5432/db_tasks';
}
router.post("/*", function(req,res){
    // post to insert new task
    var task_desc = req.body.fld_task_desc;
    var task_due ;
    var task_priority = req.body.fld_task_priority;
    var task_status = 'incomplete';
    if (req.body.fld_task_due.length == 0){
        task_due = null;
    } else {
        task_due = req.body.fld_task_due;
    }
    var strSql = '';
    var arrFields =[];
    console.log("totally insert into tasks",req.body);
    pg.connect(connectionString, function(err, client, done){
        if (err){
          console.log('error connecting to DB:', err);
          res.status(500).send(err);
          done();
          return;
    }

    strSql = 'INSERT INTO tbl_tasks ("fld_task_desc", "fld_task_due", "fld_task_priority","fld_task_status") '
    strSql += 'VALUES ($1,$2,$3,$4);';
    arrFields = [task_desc, task_due, task_priority, task_status];
    var query = client.query(strSql,arrFields);
    console.log("strSql = ", strSql);
    console.log("arrFields = ", arrFields);
    query.on('end', function(){
      res.status(200).send("successful insert");
      done();
    });

    query.on('error', function(error){
      console.log("error inserting task into DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

router.get("/*", function(req,res){

  console.log("hey you got some tasks!");
  pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }
    var results=[];
    var query = client.query('SELECT tbl_tasks.*, tbl_priorities.fld_priority_label FROM tbl_tasks JOIN tbl_priorities ON tbl_tasks.fld_task_priority = tbl_priorities.fld_priority_code ORDER BY fld_task_status, fld_task_due ;');
    query.on('row', function(row){
      results.push(row);
    });
    query.on('end', function(){
      res.send(results);
      done();
    });

    query.on('error', function(error){
      console.log("error returning tasks:", error);
      res.status(500).send(error);
      done();

    });
  })
});

router.put("/*", function(req,res){

    var fld_task_id = req.body.taskID;
    var newStatus = req.body.newStatus;
    console.log("totally UPDATE into tasks",req.body);
    pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;

    }

    strSql = "UPDATE tbl_tasks SET fld_task_status = '" + newStatus + "' WHERE fld_task_id = '" + fld_task_id + "';";
    console.log("strSql=", strSql)
    var query = client.query(strSql);
    query.on('end', function(){
      res.status(200).send("successful update of task");
      done();
    });
    query.on('error', function(error){
      console.log("error updating task in DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

router.delete("/*", function(req,res){

    var fld_task_id = req.body.taskID;
    console.log("totally DELETE from tasks",req.body);
    pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log('error connecting to DB:', err);
      res.status(500).send(err);
      done();
      return;
    }

    strSql = "DELETE FROM  tbl_tasks  WHERE fld_task_id = '" + fld_task_id + "';";
    console.log("strSql=", strSql)
    var query = client.query(strSql);
    query.on('end', function(){
      res.status(200).send("successful update of task");
      done();
    });
    query.on('error', function(error){
      console.log("error updating task in DB:", error);
      res.status(500).send(error);
      done();
    });
  })
});

module.exports = router;
