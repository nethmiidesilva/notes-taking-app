const Note = require('../models/Notes');
const mongoose = require('mongoose');
/*
//Dashboard
exports.dashboard = async (req, res) => {  
    let perPage = 12;
    let page = req.query.page || 1;

    const locals = {
        title: "Dashboard",
        description: "Free NodeJS Notes App",
    }

    try {
        Note.aggregate([
            {
                $sort: {
                    createdAt: -1,
                }
            },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id)}},
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 100] },
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, notes){
            Note.count().exec(function(err, count){
                if(err) return next(err);

                res.render('dashboard/index', {
                    userName: req.user.firstName,
                    locals,
                    notes,
                    layout: '../views/layouts/dashboard',
                    current: page,
                    pages: Math.ceil(count / perPage)
                });

            })
        })

    } catch (error) {
        console.log(error);
    }
    
}
*/
/**
 * GET /
 * Dashboard
 */
/*
exports.dashboard = async (req, res) => {

    let perPage = 12;
    let page = req.query.page || 1;
  
    const locals = {
      title: "Dashboard",
      description: "Free NodeJS Notes App.",
    };
  
    try {
      // Mongoose "^7.0.0 Update
      const notes = await Note.aggregate([
        { $sort: { updatedAt: -1 } },
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $project: {
            title: { $substr: ["$title", 0, 30] },
            body: { $substr: ["$body", 0, 100] },
          },
        },
      ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
  
      const count = await Note.count();
  
      res.render('dashboard/index', {
        userName: req.user.firstName,
        locals,
        notes,
        layout: "../views/layouts/dashboard",
        current: page,
        pages: Math.ceil(count / perPage)
      });
     } catch (error) {
      console.log(error);
    }
  };
*/

/*

// Dashboard
exports.dashboard = async (req, res) => {
    let perPage = 12;
    let page = parseInt(req.query.page) || 1;

    const locals = {
        title: "Dashboard",
        description: "Free NodeJS Notes App.",
    };

    try {
        // Fetch notes with pagination
        const notes = await Note.aggregate([
            { $sort: { updatedAt: -1 } },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 100] },
                },
            },
        ])
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();

        // Fetch total count of notes for pagination
        const count = await Note.countDocuments({ user: new mongoose.Types.ObjectId(req.user.id) });

        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

*/


// Dashboard
exports.dashboard = async (req, res) => {
    let perPage = 12;
    let page = parseInt(req.query.page) || 1;

    const locals = {
        title: "Dashboard",
        description: "Free NodeJS Notes App.",
    };

    try {
        // Fetch notes with pagination
        const notes = await Note.aggregate([
            { $sort: { updatedAt: -1 } },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 100] },
                },
            },
        ])
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();

        console.log('Notes:', notes); // Debugging output

        // Fetch total count of notes for pagination
        const count = await Note.countDocuments({ user: new mongoose.Types.ObjectId(req.user.id) });

        console.log('Count:', count); // Debugging output

        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

/*View specific Note

exports.dashboardViewNote = async(req, res) => {
    const note = await Note.findById({ _id: req.params.id }) 
    .where({ user: req.user.id }).lean();


    if (note) {
        res.render('dashboard/view-note', {
            noteID: req.params.id,
            note,
            layout: "..views/layouts/dashboard"
        });
    } else {
        res.send('Something went wrong.')
    }
}
*/

exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id })
      .where({ user: req.user.id })
      .lean();
  
    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      res.send("Something went wrong.");
    }
  };
  
/*
exports.dashboardViewNote = async (req, res) => {
    try {
        const note = await Note.findById({ _id: req.params.id })
            .where({ user: req.user.id }).lean();

        if (note) {
            res.render('dashboard/view-note', {
                noteID: req.params.id,
                note,
                layout: 'layouts/dashboard' 
            });
        } else {
            res.send('Something went wrong.');
        }
    } catch (error) {
        console.error(error);
        res.send('An error occurred while retrieving the note.');
    }
};
*/

exports.dashboardUpdateNote = async(req, res) => {
    try {
        await Note.findOneAndUpdate(
          { _id: req.params.id },
          { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
        ).where({ user: req.user.id });
        res.redirect("/dashboard");
      } catch (error) {
        console.log(error);
      }   
};

/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
    try {
      await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  
  /**
 * GET /
 * Add Notes
 */
exports.dashboardAddNote = async (req, res) => {
    res.render("dashboard/add", {
      layout: "../views/layouts/dashboard",
    });
  };

/**
 * POST /
 * Add Notes
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Note.create(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

/**
 * GET /
 * Search
 */
exports.dashboardSearch = async (req, res) => {
    try {
      res.render("dashboard/search", {
        searchResults: "",
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {}
  };
  
  /**
   * POST /
   * Search For Notes
   */
  exports.dashboardSearchSubmit = async (req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      const searchResults = await Note.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        ],
      }).where({ user: req.user.id });
  
      res.render("dashboard/search", {
        searchResults,
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {
      console.log(error);
    }
  };
