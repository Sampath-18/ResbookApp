const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config();
require("./db/conn");
const User = require("./models/userSchema");
const { MenuCategory, MenuItem } = require("./models/menuCategorySchema");
const Restaurant = require("./models/restaurantSchema");
const Section = require("./models/sectionSchema");
const Review = require("./models/ReviewSchema")
const UserLikings = require("./models/UserLikingsSchema")
// console.log(User);
const cors = require("cors");
// const bodyParser = require('body-parser');
const app = express();

const multer  = require('multer');

// Set up storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10MB
    fileSize: 50 * 1024 * 1024 // 50MB
  }, storage: storage });

const cloudinary = require("cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const port = process.env.REACT_APP_PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.get("/getUser/:id",async (req,res) => {
  try {
    const user = await User.findById(req.params.id)
    if(user)
    {
      console.log("Back-end: User found");
      return res.status(201).json({
        message:"User found",
        success:true,
        user:user
      })
    }
    else
    {
      return res.status(404).json({
        message:"User not found",
        success:false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message:"Error: retrieving user",
      success:false,
      error:error
    })
  }
})


app.get("/getRestaurants", async (req,res) => {
  try {
    const restaurants = await Restaurant.find({})
    if(restaurants)
    {
      console.log("Back-end: Restaurants found");
      return res.status(201).json({
        message:"Restaurants found",
        success:true,
        restaurants:restaurants
      })
    }
    else
    {
      return res.status(404).json({
        message:"No restaurants found",
        success:false
      })
    }
    
  } catch (error) {
    return res.status(500).json({
      message:"Error",
      success:false,
      error:error
    })
  }
})

app.get("/getSelectedRestaurants", async (req,res) => {//pass restaurant ids in req.body
  try {
    let ids = []
    for (const id of req.body.ids) {
      ids.push(new mongoose.Types.ObjectId(id))
    }
    console.log(ids);
    const restaurants = await Restaurant.find({_id: {$in:ids}})
    if(restaurants)
    {
      console.log("Back-end: Restaurants found");
      return res.status(201).json({
        message:"Restaurants found",
        success:true,
        restaurants:restaurants
      })
    }
    else
    {
      return res.status(404).json({
        message:"No restaurants found",
        success:false
      })
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Error",
      success:false,
      error:error
    })
  }
})

app.get("/getSection/:id", async(req,res) => {//return section given a section Id
  try {
    const sid=req.params.id
    const section = await Section.findById(sid)
    if(section)
    {
      console.log("Backend:Section found");
      res.status(201).json({
        message:"Section found",
        success:true,
        section:section
      })
    }
    else
    {
      res.status(404).json({
        message:"Section not found in DB",
        success:false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message:"Error",
      success:false,
      error:error
    })
  }
})

app.get("/:id/getSections", async(req,res) => {//return sections given a restaurant Id
  try {
    const restaurantId = req.params.id
    const restaurant = await Restaurant.findById(restaurantId)
    if(restaurant)
    {
      const secIds = restaurant.sections
      const sections = []
      for (const secId of secIds) {
        const section = await Section.findById(secId)
        if(section)
        {
          sections.push(section)
        }
        else{
          console.log("Section with id:",secId,"not found in DB");
        }
      }
      return res.status(201).json({
        message:"Sections found for restaurant:"+restaurant.name,
        success:true,
        sections:sections
      })
    }
    else
    {
      return res.status(404).json({
        message:"Restaurant not found",
        success:false
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Error/exception caught in Backend",
      success:false
    })
  }
})

app.get("/getRestaurant/:id", async (req,res) => {
  try {
    const rid=req.params.id
    const restaurant = await Restaurant.findById(rid)
    if(restaurant)
    {
      console.log("Restaurant found");
      res.status(201).json({
        message:"Restaurant found",
        success:true,
        restaurant:restaurant
      })
    }
    else
    {
      res.status(404).json({
        message:"Restaurant not found in DB",
        success:false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message:"Error",
      success:false,
      error:error
    })
  }
})

app.get("/:id/getMenuCategories", async (req,res) => {
  try {
    console.log(req.params.id);
    const secId=req.params.id
    const section = await Section.findById(secId)
    if(section)
    {
      const menuCategoryIds = section.menu
      // console.log(section);
      const menuCategories = []
      for(const menuCategoryId of menuCategoryIds) {
        const category = await MenuCategory.findById(menuCategoryId)
        if(category)
        {
          menuCategories.push(category)
        }
        else
        {
          console.log("category with id:",menuCategoryId," not found ");
        }
      }
      return res.status(201).json({
        message:"Found categories",
        success:true,
        menuCategories:menuCategories
      })
    }
    else
    {
      return res.status(404).json({
        message:"Section not found",
        success:false
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Error/exception caught in Backend",
      success:false
    })
  }
})

app.get("/getMenuCategory/:id", async(req,res) => {
  try {
    const categoryId = req.params.id
    const category = await MenuCategory.findById(categoryId)
    if(category)
    {
      const itemIds = category.Items
      const items=[]
      for (const itemId of itemIds ) {
        const item = await MenuItem.findById(itemId)
        if(item)
        {
          items.push(item)
        }
        else
        {
          console.log("Item id:",itemId,"not found");
        }
      }
      category.Items = items
      return res.status(201).json({
        message:"Category Found",
        success:true,
        menuCategory:category
      })
    }
    else
    {
      return res.status(404).json({
        message:"Menu Category not found",
        success:false
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Error/exception caught in Backend",
      success:false
    })
  }
})

app.get("/getUserLikings/:id", async(req,res) => {
  try {
    const userliking = await UserLikings.findOne({userId:req.params.id})
    if(userliking)
    {
      return res.status(200).json({
        message:"User likings retrieved successfully!!",
        success:true,
        userlikings:userliking
      })
    }
    else{
      return res.status(404).json({
        message:"User likings not found",
        success:false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message:"Error at backend",
      success:false
    })
  }
})

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
        cuisines: sectionFrontEnd.cuisines.split(","),
        searchTags: sectionFrontEnd.searchTags.split(",")
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

const fs = require('fs');
const path = require('path');
const os = require('os');
app.post("/updateSectionImages/:id", upload.array('secImg'), async (req,res) => {
  try {
    const section = await Section.findById(req.params.id)
    if(section)
    {
      // console.log(Object.keys(req))
      // console.log(Object.keys(req.body))
      const images = req.files.map(file => file.buffer); // Retrieve image data from uploaded files
      // console.log(images);
      // console.log(req.files);
      // const images = req.files.secImg
      const secImg = []
      // for (const image of images) {
      //   const mycloudImage = await cloudinary.v2.uploader.upload(image,{
      //     folder: "Resbook/MenuItemImages",
      //   })
      //   console.log("url:",mycloudImage)
      //   secImg.push({
      //     url:mycloudImage.secure_url,
      //     public_id:mycloudImage.public_id
      //   })
      // }
      for (const image of images) {
        const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`);
        
        try {
          fs.writeFileSync(tempFilePath, image);
          const mycloudImage = await cloudinary.v2.uploader.upload(tempFilePath, {
            folder: "Resbook/SectionImages",
          });
          // console.log("url:",mycloudImage)
          secImg.push({
            url:mycloudImage.secure_url,
            public_id:mycloudImage.public_id
          })
        } catch (error) {
          console.error(error);
        } finally {
          fs.unlinkSync(tempFilePath); // delete the temporary file
        }
      }
      section.secImg = secImg
      await section.save()
      console.log("Backend: images successfully uploaded to section:",section.sectionName);
      return res.status(201).json({
        message:"Section images added successfully",
        success: true
      })
    }
    else{
      res.status(501).json({
        message:"Section with id: "+req.params.id+" not found in DB.",
        success: false
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message:"Error:Images addition for section failed",
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

app.post("/updateRestaurant/updateImage/:id", upload.single('coverImage'), async (req,res) => {
  try {
    // console.log("bedore file upload");
    let restaurant = await Restaurant.findById(req.params.id)
    if(restaurant)
    {
      const coverImage = req.file.buffer
      // console.log(coverImage)
      const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`);
      try {
        fs.writeFileSync(tempFilePath, coverImage);
        const mycloudImage = await cloudinary.v2.uploader.upload(tempFilePath, {
          folder: "Resbook/RestaurantImages",
        });
        // console.log("url:",mycloudImage)
        restaurant.coverImage = {
          url:mycloudImage.secure_url,
          public_id:mycloudImage.public_id
        }
        await restaurant.save()
      } catch (error) {
        console.error(error);
      } finally {
        fs.unlinkSync(tempFilePath); // delete the temporary file
      }
      return res.status(201).json({
        message:"Image updated successfully",
        success:true,
        image: restaurant.coverImage
      })
    }
    else
    {
      res.status(404).json({
        message:"Restaurant with id: "+req.params.id+" not found in DB.",
        success: false
      })
    }
  } catch (error) {
    // console.error(error)
    res.status(500).json({
      message:"Restaurant image updation failed",
      success: false,
      error:error
    })
  }
})

app.post("/addRestaurant",async (req,res) => {
  try {
    const restaurantFrontEnd = req.body
    // console.log(restaurantFrontEnd);
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
      sections: [],
      avgCost: restaurantFrontEnd.avgCost
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
    console.error(error);
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

app.post("/updateUserLikings/:id", async (req,res) => {
  // console.log(req.body);
  try {
    let userliking = await UserLikings.findOne({userId:req.params.id})
    if(userliking)
    {
      // console.log(userliking);
      if(req.body.operation==="add")
      {
        if(userliking[req.body.favType].findIndex(fav => fav.equals(req.body.idToOperateOn))===-1)
        {
          userliking[req.body.favType].push(req.body.idToOperateOn)
        }
        else
        {
          res.status(201).json({
            message:req.body.favType+" already contains!!",
            success:true,
            userlikings:userliking
          })
        }
      }
      else if(req.body.operation==="remove")
      {
        userliking[req.body.favType] = userliking[req.body.favType].filter((id) => !(id.equals(req.body.idToOperateOn)))
      }
      await userliking.save()
      if(userliking)
      {
        return res.status(200).json({
          message:req.body.favType+" updated successfully!!",
          success:true,
          userlikings:userliking
        })
      }
      else
      {
        return res.status(500).json({
          message:req.body.favType+" updation failed!!",
          success:false
        })
      }
    }
    else
    {
      res.status(404).json({
        message:"User not found!!",
        success:false
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Error:backend",
      success:false
    });
  }
})


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
            .then(async (addedUser) => {
              console.log("Added user Id: ", addedUser._id);
              const userLikings = new UserLikings({
                userId: addedUser._id
              })
              await userLikings.save()
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

app.post("/updateUserLikings/addSection/:id", async (req,res) => {
  try {
    let userliking = await UserLikings.findOne({userId:req.params.id})
    if(userliking)
    {
      // console.log(userliking);
      userliking.favSections.push(req.body.sectionId)
      await userliking.save()
      if(userliking)
      {
        res.status(200).json({
          message:"Section added to favorites successfully!!",
          success:true
        })
      }
      else
      {
        res.status(500).json({
          message:"Section addition to favorites failed!!",
          success:false
        })
      }
    }
    else
    {
      res.status(404).json({
        message:"User not found!!",
        success:false
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:"Error:backend",
      success:false
    });
  }
})

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
    if(userLogin)
    {
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
    }
    else
    {
      console.log("Backend:User not found")
      return res.status(500).json({
        message:"User doesn't exist",
        success:false
      })
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.post("/restaurantLogin", async (req, res) => {
  console.log("backend:", req.body);
  if(!req.body.email || !req.body.password)
  {
    return res.status(400)
    .json({ err: "missing credentials", success: false })
  }
  try {
    const restaurantLogin = await Restaurant.findOne({ "admin.email": req.body.email });
    if(restaurantLogin)
    {
      bcrypt.compare(req.body.password, restaurantLogin.admin.password, function(err,result) {
        if(err)
        {
          console.error(err)
          return res.json({ message:"Invalid credentials/ Wrong password", success: false });
        }
        else if(result)
        {
          return res.status(200).json({ success: true, restaurantId: restaurantLogin._id });
        }
      })
    }
    else
    {
      console.log("Backend:Restaurant not found")
      return res.status(500).json({
        message:"Restaurant doesn't exist",
        success:false
      })
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.post("/setRestaurantPassword", async(req, res) => {
  // console.log("set restaurant password called");
  if(!req.body.email || !req.body.password)
  {
    return res.status(400)
    .json({ err: "missing credentials", success: false })
  }
  try {
    const restaurantLogin = await Restaurant.findOne({ "admin.email": req.body.email });
    if(restaurantLogin)//user exists in our DB
    {
      const salt = await bcrypt.genSalt(10);
      let secPassword = await bcrypt.hash(req.body.password, salt);
      try {
        const result = await Restaurant.updateOne(
          {"admin.email": req.body.email},
          {$set: {"admin.password": secPassword}},
        )
        // if(result.modifiedCount>0)
        // {
          console.log('updated restaurant password');
          return res.status(200).json({
            success:true,
            message:"Updated restaurant password in DB successfully"
          })
        // }
      } catch (error) {
        return res.status(500).json({
          success:false,
          message:"failed to change the restaurant password"
        })
      }
    }
    else
    {
      console.log("Backend:Restaurant not found")
      return res.status(500).json({
        message:"Restaurant with given email not registered, please create a restaurant",
        success:false
      })
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, error:err });
  }
})


app.post("/setUserPassword", async(req, res) => {
  // console.log("set user password called");
  if(!req.body.email || !req.body.password)
  {
    return res.status(400)
    .json({ err: "missing credentials", success: false })
  }
  try {
    const userLogin = await User.findOne({ email: req.body.email });
    if(userLogin)//user exists in our DB
    {
      // code for comparing password with stored password
      // bcrypt.compare(password, userLogin.password, function(err,result) {
      //   if(err)
      //   {
      //     console.error(err)
      //     return res.json({ message:"Invalid credentials/ Wrong password", success: false });
      //   }
      //   else if(result)
      //   {
      //     return res.status(200).json({ success: true, user: userLogin });
      //   }
      // })
      const salt = await bcrypt.genSalt(10);
      let secPassword = await bcrypt.hash(req.body.password, salt);
      try {
        const result = await User.updateOne(
          {email: req.body.email},
          {$set: {password: secPassword}},
        )
        // if(result.modifiedCount>0)
        // {
          console.log('updated user password');
          return res.status(200).json({
            success:true,
            message:"Updated password in DB successfully"
          })
        // }
      } catch (error) {
        return res.status(500).json({
          success:false,
          message:"failed to change the password"
        })
      }
    }
    else
    {
      console.log("Backend:User not found")
      return res.status(500).json({
        message:"Email not registered, please sign-in to create an account",
        success:false
      })
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, error:err });
  }
})

app.post("/retrieve/user", async (req, res) => {
  console.log("backend called for user retrieval:", req.body);
});

const DineinBookings = require("./models/DineinBookingSchema")

app.post("/bookDineinSection", async(req,res) => {
  try {
    const booking = req.body
    if(booking.guests.length<1)
    {
      return res.status(500).json({
        message:"No. of guests should be greater than one!!!",
        success:false
      })
    }
    if(!booking.reservationTime)//!booking.userId && !booking.sectionId)
    {
      return res.status(500).json({
        message:"ReservationTime not selected",
        success:false
      })
    }
    const bookingDBEntry = new DineinBookings(booking)
    await bookingDBEntry.save()
    const user = await User.findById(booking.userId)
    if(user)
    {
      user.bookings.push(bookingDBEntry._id)
      await user.save()
      const section = await Section.findById(booking.sectionId)
      if(section)
      {
        const restaurant = await Restaurant.findById(section.restaurantId)
        if(restaurant)
        {
          
          return res.status(201).json({
            message:"dinein booked successfully",
            success:true,
            booking:bookingDBEntry,
            restaurant:restaurant,
            section:section
          })
        }
        else
        {
          return res.status(500).json({
            message:"Restaurant not found: booking failed",
            success:false
          })
        }
      }
      else
      {
        return res.status(500).json({
          message:"Section not found: booking failed",
          success:false
        })
      }
    }
    else
    {
      return res.status(500).json({
        message:"User not found: booking failed",
        success:false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message:"Booking failed",
      success:false
    })
  }
})

app.post("/addReview",async (req,res) => {
  try {
    const review = req.body
    if(!review.rating || !review.restaurantRating)
    {
      return res.status(500).json({
        message:"Section rating or Restaurant rating missing",
        success:false
      })
    }
    const reviewDbEntry = new Review(review)
    reviewDbEntry.save()
    .then(async (addedReview) => {
      console.log("Backend: New review",addedReview._id,"added successfully");
      const section = await Section.findById(review.sectionId)
      if(section)
      {
        section.rating = ((section.rating*(section.reviews.length+section.ratings.length))+review.rating)/(section.reviews.length+section.ratings.length+1)
        if(review.review)
        {
          // section.noOfReviews = section.noOfReviews+1
          section.reviews.push(addedReview._id)
          // await section.save()
        }
        else
        {
          section.ratings.push(addedReview._id)
        }
        await section.save()
        const rId = section.restaurantId
        const restaurant = await Restaurant.findById(rId)
        if(restaurant)
        {
          restaurant["rating"] = (restaurant["rating"]*restaurant["noOfRatings"]+review.restaurantRating)/(restaurant["noOfRatings"]+1)
          restaurant["noOfRatings"]=restaurant["noOfRatings"]+1
          await restaurant.save()
        }
      }
      return res.status(201).json({
        message:"Review added succesfully",
        success:true,
        review:addedReview
      })
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        message:"Review addition failed",
        success:false,
        error:err
      })
    })
  } catch (error) {
    return res.status(500).json({
      message:"Review addition failed",
      success:false
    })
  }
})

app.get("/getBookingSummary/:id", async(req,res) => {
  try {
    const bookingDBEntry = await DineinBookings.findById(req.params.id)
    if(bookingDBEntry)
    {
      const section = await Section.findById(bookingDBEntry.sectionId)
      if(section)
      {
        const restaurant = await Restaurant.findById(section.restaurantId)
        if(restaurant)
        {
          return res.status(201).json({
            message:"Booking retrieved successfully",
            success:true,
            booking:bookingDBEntry,
            restaurant:restaurant,
            section:section
          })
        }
        else
        {
          return res.status(500).json({
            message:"Restaurant not found for this booking",
            success:false
          })
        }
      }
      else
      {
        return res.status(500).json({
          message:"Section not found for this booking",
          success:false
        })
      }
    }
    else
    {
      return res.status(404).json({
        message:"Booking not found in DB",
        success:false
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:"Booking not found: error occured",
      success:false,
      error:error
    })
  }
})

app.get("/getReviews/:id", async(req,res) => {
  try {
    const reviews = await Review.find({sectionId:req.params.id})//retrieve reviews using section Id
    if(reviews.length!==0)
    {
      // console.log("Backend: found reviews",reviews);
      return res.status(200).json({
        message:"Reviews found",
        success:true,
        reviews:reviews
      })
    }
    else
    {
      return res.status(500).json({
        message:"No Reviews found",
        success:false
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message:"Reviews retrieval failed",
      success:false
    })
  }
})

app.get("/getReview/:id", async(req,res) => {
  try {
    let review = await Review.findById(req.params.id)
    if(review)
    {
      // console.log("Backend: found review",review);
      const user = await User.findById(review.userId)
      review = {...review._doc, user:user.fname+" "+user.lname}
      return res.status(200).json({
        message:"Reviews found",
        success:true,
        review:review
      })
    }
    else
    {
      return res.status(500).json({
        message:"No Reviews found",
        success:false
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message:"Reviews retrieval failed",
      success:false
    })
  }
})


app.listen(port, () => {
  console.log(`server is connected to ${port}`);
});
