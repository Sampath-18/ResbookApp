const express = require("express");
require("dotenv").config();
require("./db/conn");
const User = require("./models/userSchema");
const { MenuCategory, MenuItem } = require("./models/menuCategorySchema");
const Restaurant = require("./models/restaurantSchema");
const Section = require("./models/sectionSchema");
// console.log(User);
const cors = require("cors");
// const bodyParser = require('body-parser');
const app = express();

// const auth=require('./routers/auth.js')

const port = process.env.REACT_APP_PORT;
// console.log(process.env.REACT_APP_PORT);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// below code is to prevent permission errors to access DB
// app.use((req,res,next) => {
//   res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers", "Origin, X-Requested-With,  Content-Type, Accept"
//   );
//   next();
// })
// app.use('/auth',auth)

app.get("/", (req, res) => {
  res.send("<h1>namaste</h1>");
});

const bcrypt = require("bcryptjs");

// body:{
//   restaurant:{
//     name:String,
//     location:location,
//     sections:[sectionIds],//to be added
//     admin:adminSchema,
//     parkingAvailable:yes/no
//   },
//   sections:[
//     {
//       sectionName:String,
//       sectionDescription:String,
//       secImg:[imgSchema],
//       capacity:num,
//       dineinAvailable:yes/no,
//       autoAcceptBookings:yes/no,
//       cateringAvailable:yes/no,
//       avgCost:num,
//       rating:1/2/3/4/5,
//       timing:timing,
//       menu:[menuCategoryIds],//to be added,
//       restaurantId:restId,//to be added,
//     }
//   ]
// }

// "timing": {
//   "Monday":{
//     "open_time": "",
//     "close_time": ""
//   },
//   "Tuesday":{
//     "open_time": "",
//     "close_time": ""
//   },
//   "Wednesday":{
//     "open_time": "",
//     "close_time": ""
//   },
//   "Thursday":{
//     "open_time": "",
//     "close_time": ""
//   },
//   "Friday":{
//     "open_time": "",
//     "close_time": ""
//   },
//   "Saturday":{
//     "open_time": "",
//     "close_time": ""
//   },
//   "Sunday":{
//     "open_time": "",
//     "close_time": ""
//   }
// },

const timeToDateForTimings = (timing) => {
  Object.keys(timing).forEach((day) => {
    timing[day]["open_time"] = new Date(
      new Date().toDateString() + " " + timing[day]["open_time"]
    );
    timing[day]["close_time"] = new Date(
      new Date().toDateString() + " " + timing[day]["close_time"]
    );
  });
  return timing;
};


// {
//   "sectionName": "Bar",
//   "sectionDescription": "Alcoholics this one is for you",
//   "secImg": [],
//   "capacity": 60,
//   "dineinAvailable": "Yes",
//   "autoAcceptBookings": "Yes",
//   "cateringAvailable": "Yes",
//   "avgCost": 1200,
//   "rating": 4,
//   "timing": {
//     "Monday": {
//       "open_time": "11:57",
//       "close_time": "11:54"
//     },
//     "Tuesday": {
//       "open_time": "12:52",
//       "close_time": "17:00"
//     },
//     "Wednesday": {
//       "open_time": "08:00",
//       "close_time": "21:30"
//     },
//     "Thursday": {
//       "open_time": "08:30",
//       "close_time": "23:00"
//     },
//     "Friday": {
//       "open_time": "17:00",
//       "close_time": "03:29"
//     },
//     "Saturday": {
//       "open_time": "12:00",
//       "close_time": "23:00"
//     },
//     "Sunday": {
//       "open_time": "14:59",
//       "close_time": "22:53"
//     }
//   },
//   "menu": [],
//   "reservationCharge": 25
// }
app.post("/updateRestaurant/addSection/:id", async (req,res) => {
  try {
    // console.log("id:",req.params.id);
    const restaurant = await Restaurant.findById(req.params.id)
    // console.log("Restaurant:",restaurant)
    if(restaurant)
    {
      const sectionFrontEnd = req.body
      // console.log("restaurant Id:",req.params.id);
      const section = new Section({
        sectionName: sectionFrontEnd.sectionName,
        sectionDescription: sectionFrontEnd.sectionDescription,
        secImg: [],//sectionFrontEnd.secImg,
        capacity: sectionFrontEnd.capacity,
        dineinAvailable: sectionFrontEnd.dineinAvailable,
        autoAcceptBookings: sectionFrontEnd.autoAcceptBookings,
        cateringAvailable: sectionFrontEnd.cateringAvailable,
        avgCost: sectionFrontEnd.avgCost,
        // rating: 0, initially no ratings
        timing: timeToDateForTimings(sectionFrontEnd.timing),
        menu: [],// category Ids to be added later
        reservationCharge: sectionFrontEnd.reservationCharge,
        restaurantId: req.params.id,
      });
      await section.save();// add section to DB
      const secId = section._id;
      // console.log("added section : ", secId);

      restaurant.sections.push(secId)
      await restaurant.save()
      console.log( "\n\nSection:", section.sectionName, " added to Restaurant:", restaurant.name, "\n\n" );
      return res.status(201).json({
        message:"Section added successfully",
        success: true,
        sectionId: secId
      })
    }
    else
    {
      return res.status(501).json({
        message:"Restaurant with id : "+req.params._id+" not found in DB",
        success: false
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message:"Section addition failed",
      success: false
    })
  }
})

app.post("/updateRestaurant/updateSection/addMenuCategory/:id",async (req,res) => {
  try {
    const section = await Section.findById(req.params.id)
    if(section)
    {
      const menuCategoryFrontend = req.body
      const menuCategory = new MenuCategory({
        categoryName: menuCategoryFrontend.categoryName,
        sectionId: req.params.id,
      })
      await menuCategory.save();//add menuCategory to DB
      console.log("added Category:", menuCategory._id)
      section.menu.push(menuCategory._id);
      await section.save();
      console.log( "\n\ncategory:", menuCategory.categoryName, " added to section:", section.sectionName, "\n\n" );
      return res.status(201).json({
        message:"Menu Category added successfully",
        success:true,
        menuCategoryId: menuCategory._id
      })
    }
    else{
      res.status(501).json({
        message:"Section with id: "+req.params.id+" not found in DB.",
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      message:"Menu Category addition failed",
      success: false
    })
  }
})


// {
//   "itemName":"Chilli Chicken",
//   "quantities":[{
//     "quantity":"small",
//     "cost":175,
//     "avgPersons":1
//   },
//   {
//     "quantity":"medium",
//     "cost":270,
//     "avgPersons":2
//   },
//   {
//     "quantity":"large",
//     "cost":450,
//     "avgPersons":3
//   }]
// }
app.post("/updateRestaurant/updateSection/updateMenuCategory/addMenuItem/:id", async (req,res) => {
  try {
    // console.log("add item -Backend called for id:",req.params.id)
    const menuCategory = await MenuCategory.findById(req.params.id)
    if(menuCategory)
    {
      const menuItemFrontEnd = req.body
      const menuItem = new MenuItem({
        itemName: menuItemFrontEnd.itemName,
        quantities: menuItemFrontEnd.quantities,
        menuCategoryId: req.params.id,
      })
      // add menu item to DB
      await menuItem.save();
      // console.log("menu Item:", menuItem._id);
      // console.log("menu Item:", menuItem);
      // add item id to category document in DB
      menuCategory.Items.push(menuItem._id);
      await menuCategory.save();
      console.log( "\nitem : ", menuItem.itemName, " added to category : ", menuCategory.categoryName, "\n" );
      res.status(201).json({
        message:"Menu Item : "+menuItem.itemName+" added to Menu Category : "+menuCategory.categoryName,
        success:true,
        menuItemId:menuItem._id
      })
    }
    else
    {
      res.status(501).json({
        message:"Menu Category with id: "+req.params.id+" not found in DB.",
        success: false
      })
    }
  } catch (error) {
    res.status(500).json({
      message:"Menu Item addition failed",
      success: false
    })
  }
})

app.post("/addRestaurant",async (req,res) => {
  try {
    const restaurantFrontEnd = req.body
    const restaurantExist = await Restaurant.findOne({'admin.email':restaurantFrontEnd.admin.email})
    if(restaurantExist)
    {
      return res.status(500).json({
        message:"Already a restaurant exists with the given email id",
        success: false
      })
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(restaurantFrontEnd.admin.password, salt);
    const admin = {...restaurantFrontEnd.admin, password:secPassword}
    const restaurant = new Restaurant({
      name: restaurantFrontEnd.name,
      location: restaurantFrontEnd.location,
      admin: admin,
      parkingAvailable: restaurantFrontEnd.parkingAvailable,
      sections: []
    });
    await restaurant.save();// save restaurant to DB
    // console.log("Restaurant:",restaurant);
    const resId = restaurant._id;
    console.log("added res ID:", resId);
    res.status(201).json({
      message: "Restaurant added successfully",
      success: true,
      restaurantId: restaurant._id
    })
  } catch (error) {
    return res.status(500).json({
      message: "Restaurant addition failed",
      success: false
    })
  }
})

app.post("/addRestaurantprevious", async (req, res) => {
    const body = req.body;
    // console.log("Add restaurant", body);
    try {
      const restaurantFrontEnd = body.restaurant;
      const restaurant = new Restaurant({
        name: restaurantFrontEnd.name,
        location: restaurantFrontEnd.location,
        admin: restaurantFrontEnd.admin,
        parkingAvailable: restaurantFrontEnd.parkingAvailable,
        sections: [],
      });
      await restaurant.save();// save restaurant to DB
      // console.log("Restaurant:",restaurant);
      const resId = restaurant._id;
      console.log("added res ID:", resId);
      const sections = body.sections;
      await sections.forEach( async(sectionFrontEnd) => {
        const section = new Section({
          sectionName: sectionFrontEnd.sectionName,
          sectionDescription: sectionFrontEnd.sectionDescription,
          secImg: sectionFrontEnd.secImg,
          capacity: sectionFrontEnd.capacity,
          dineinAvailable: sectionFrontEnd.dineinAvailable,
          autoAcceptBookings: sectionFrontEnd.autoAcceptBookings,
          cateringAvailable: sectionFrontEnd.cateringAvailable,
          avgCost: sectionFrontEnd.avgCost,
          rating: sectionFrontEnd.rating,
          timing: timeToDateForTimings(sectionFrontEnd.timing),
          menu: [],// category Ids to be added later
          reservationCharge: sectionFrontEnd.reservationCharge,
          restaurantId: resId,
        });
        await section.save();// add section to DB
        const secId = section._id;
        console.log("added section : ", secId);
        const menu = sectionFrontEnd.menu;
        menu.forEach( async (menuCategoryFrontend) =>{
          const menuCategory = new MenuCategory({
            categoryName: menuCategoryFrontend.categoryName,
            sectionId: secId,
          });
          await menuCategory.save();//add menuCategory to DB
          console.log("added Category:", menuCategory._id);
          // console.log("Category:", menuCategory);
          const categoryId = menuCategory._id;
          menuCategoryFrontend.Items.forEach( async(menuItemFrontEnd) => {
            const menuItem = new MenuItem({
              itemName: menuItemFrontEnd.itemName,
              quantities: menuItemFrontEnd.quantities,
              menuCategoryId: categoryId,
            });

            // add menu item to DB
            await menuItem.save();
            // add item id to category document in DB
            console.log("menu Item:", menuItem._id);
            // console.log("menu Item:", menuItem);
            menuCategory.Items.push(menuItem._id);
            await menuCategory.save();
            console.log( "\n\nitem : ", menuItem.itemName, " added to category : ", menuCategory.categoryName, "\n\n" );
          })
          section.menu.push(categoryId);
          await section.save();
          console.log( "\n\ncategory:", menuCategory.categoryName, " added to section:", section.sectionName, "\n\n" );
        })
        restaurant.sections.push(secId);
        await restaurant.save();
        console.log( "\n\nsection:", section.sectionName, " added to restaurant:", restaurant.name, "\n\n" );
      })
      console.log("Restaurant saved and updated: from back-end........");
      return res.status(201).json({
        message: "Restaurant added successfully",
        success: true,
      })
    } catch (error) {
      return res.status(500).json({
        message: "Restaurant not added",
        success: false
      })
    }
  }
)






// app.post("/addRestaurant", async (req, res) => {
//   const body = req.body;
//   // console.log("Add restaurant", body);
//   try {
//     const restaurantFrontEnd = body.restaurant;
//     const restaurant = new Restaurant({
//       name: restaurantFrontEnd.name,
//       location: restaurantFrontEnd.location,
//       admin: restaurantFrontEnd.admin,
//       parkingAvailable: restaurantFrontEnd.parkingAvailable,
//       sections: [],
//     });
//     // sectionIds to be added after cretaing their objects in DB
//     await restaurant.save();
//     // console.log("Restaurant:",restaurant);
//     const resId = restaurant._id;
//     console.log("added res ID:", resId);
//     const sections = body.sections;
//     sections
//       .forEach(async (sectionFrontEnd) => {
//         // console.log(timeToDateForTimings(sectionFrontEnd.timing));
//         const section = new Section({
//           sectionName: sectionFrontEnd.sectionName,
//           sectionDescription: sectionFrontEnd.sectionDescription,
//           secImg: sectionFrontEnd.secImg,
//           capacity: sectionFrontEnd.capacity,
//           dineinAvailable: sectionFrontEnd.dineinAvailable,
//           autoAcceptBookings: sectionFrontEnd.autoAcceptBookings,
//           cateringAvailable: sectionFrontEnd.cateringAvailable,
//           avgCost: sectionFrontEnd.avgCost,
//           rating: sectionFrontEnd.rating,
//           timing: timeToDateForTimings(sectionFrontEnd.timing),
//           menu: [],// category Ids to be added later
//           reservationCharge: sectionFrontEnd.reservationCharge,
//           restaurantId: resId,
//         });
//         // console.log("......................section debug....................",section);
//         //add section to DB
//         await section.save();
//         // console.log("section:", section);
//         const secId = section._id;
//         console.log("added section : ", secId);
//         const menu = sectionFrontEnd.menu;
//         menu.forEach(async (menuCategoryFrontend) => {
//           const menuCategory = new MenuCategory({
//             categoryName: menuCategoryFrontend.categoryName,
//             sectionId: secId,
//           });

//           //add menuCategory to DB
//           await menuCategory.save();
//           console.log("added Category:", menuCategory._id);
//           // console.log("Category:", menuCategory);
//           const categoryId = menuCategory._id;
//           menuCategoryFrontend.Items.forEach(async (menuItemFrontEnd) => {
//             const menuItem = new MenuItem({
//               itemName: menuItemFrontEnd.itemName,
//               quantities: menuItemFrontEnd.quantities,
//               menuCategoryId: categoryId,
//             });

//             // add menu item to DB
//             await menuItem.save();
//             // add item id to category document in DB
//             console.log("menu Item:", menuItem._id);
//             // console.log("menu Item:", menuItem);
//             menuCategory.Items.push(menuItem._id);
//             await menuCategory.save();
//             console.log(
//               "\n\nitem : ",
//               menuItem.itemName,
//               " added to category : ",
//               menuCategory.categoryName,
//               "\n\n"
//             );
//             // .catch(err)
//             // {
//             //   console.log("error adding item to category......")
//             // }
//           });

//           // add menu category id to section
//           section.menu.push(categoryId);
//           await section.save();
//           console.log(
//             "\n\ncategory:",
//             menuCategory.categoryName,
//             " added to section:",
//             section.sectionName,
//             "\n\n"
//           );
//           // .catch(err)
//           // {
//           //   console.log("error adding category to section......")
//           // }
//         }); // category saved and added to section's menu
//       }) //section saved
//       .catch(err);
//     {
//       res.status(500).json({ error: "failed to save section", success: false });
//     }
//     // add section id to restaurant
//     restaurant.sections.push(secId);
//     await restaurant.save();
//     console.log(
//       "\n\nsection",
//       section.sectionName,
//       " added to restaurant:",
//       restaurant.name,
//       "\n\n"
//     );
//     // .catch(err)
//     // {
//     //   console.log("error adding section to restaurant......")
//     // }
//     console.log("Restaurant saved and updated: from back-end........");
//     return res.status(201).json({
//       message: "Restaurant added successfully",
//       success: true,
//     });
//     // .catch(err)
//     // {
//     //   res.status(500).json({ error: "failed to register restaurant", success: false });
//     // }
//   } catch (error) {}
// });

app.post("/signup", async (req, res) => {
  // console.log("body: ", req.body);
  const { fname, lname, email, password, cpassword } = req.body;
  try {
    if (!fname || !lname || !email || !password || !cpassword) {
      return res
        .status(422)
        .json({ error: "please fill the field property", success: false });
    }
    if (password != cpassword) {
      return res
        .status(422)
        .json({ error: "password do not match", success: false });
    } else {
      User.findOne({ email: email }).then(async (user) => {
        if (user) {
          return res
            .status(422)
            .json({ error: "Email already exists", success: false });
        } else {
          const salt = await bcrypt.genSalt(10);
          let secPassword = await bcrypt.hash(password, salt);
          // console.log(password, " : ", secPassword);
          const user = new User({
            fname: fname,
            lname: lname,
            email: email,
            password: secPassword,
          });
          user
            .save()
            .then((addedUser) => {
              console.log("Added user Id: ", addedUser._id);
              return res.status(201).json({
                message: "user created successfully",
                userId: addedUser._id,
                success: true,
              });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ error: "failed to register", success: false });
            });
        }
      });
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/login", async (req, res) => {
  console.log("backend:", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ err: "please fill the above details", success: false });
  }
  try {
    const userLogin = await User.findOne({ email: email });
    if(!userLogin)
    {
      return res.status(500).json({
        message:"User doesn't exist",
        success:false
      })
    }
    bcrypt.compare(password, userLogin.password, function(err,result) {
      if(err)
      {
        console.error(err)
        return res.json({ message:"Invalid credentials/ Wrong password", success: false });
      }
      else if(result)
      {
        return res.status(200).json({ success: true, user: userLogin });
      }
    })
    // if (userLogin.password == password) {
    //   return res.json({ success: true, user: userLogin });
    // } else !userLogin;
    // {
    //   res.status(400).json({ error: "user error", success: false });
    // }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.post("/retrieve/user", async (req, res) => {
  console.log("backend called for user retrieval:", req.body);
});

app.listen(port, () => {
  console.log(`server is connected to ${port}`);
});
