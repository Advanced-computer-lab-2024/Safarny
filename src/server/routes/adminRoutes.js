const { Router } = require("express");
const router = Router();

const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("../controllers/activitycategoryController.js");

const {getActivityRevenue} = require("../controllers/activityController.js");

const {
    createPost,
    getAllPosts,
    updatePostById,
    getPostById,
    deletePostById,
    deletePostsByCreator,
    getTotalRevenue
} = require("../controllers/postsController.js");

const { addAdmin } = require("../controllers/signUpController.js");

const {
    getUsers,
    deleteUser,
    getSingleUser,
    updateUser,
    createProfile,
    getProfileById,
    updateProfileById,
    getAllUsers,
    updateAcceptedStatus,
    updateDeleteAccount,
    deleteTourGuideAndIterinaries,
    deleteAdvertiserAndActivities,
    getUserCounts
} = require("../controllers/usersController.js");

const { addGovernor } = require("../controllers/addgovernorController.js");

const {
    createTag,
    getAllTags,
    getAllTagsFilter,
    getTagById,
    updateTagById,
    deleteTagById,
} = require('../controllers/tagsController');


const {
    getAllComplaints,
    updateComplaintById,

} = require("../controllers/userComplaintsController.js");


const {
    getItineraryRevenue

} = require("../controllers/itineraryController.js");


const {
    createPromoCode,
    getPromoCodeById,
    updatePromoCode,
    getAllPromoCodes,
  } = require("../controllers/PromoCodeController.js");


/*
    1-post toursimGoverner
    2-delete user
    3-post admin
    4-CRUD on activityCategory
    5-CRUD on tags
    6-post product
    7-edit product 
    8-get all products
    9-get all products by name
    10-get all products by price
    11-get all products sorted by rating
*/



//const router = express.Router();

// Route for creating a promo code
router.post("/promocodes", createPromoCode);

// Route for getting all promo codes
router.get("/promocodes", getAllPromoCodes);

// Route for getting a promo code by ID
router.get("/promocodes/:id", getPromoCodeById);

// Route for updating a promo code by ID
router.put("/promocodes/:id", updatePromoCode);

//module.exports = router;


router.get("/getActivitiesRevenue", getActivityRevenue);   
router.get("/getItinerarayRevenue", getItineraryRevenue);   
router.get("/getUsers", getUsers);   
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);   
router.put("/updateUserStatus/:id", updateAcceptedStatus);       
router.put("/UpdateProfileById", updateProfileById); 
router.post("/addAdmin", addAdmin);  
router.post("/createProduct", createPost);


// Route for getting all posts (products)
router.get("/products", getAllPosts);
// Route for getting a single post (product) by ID
router.get("/products/:id", getPostById); // Add this line for getting post by ID


// Route for updating a post (product) by ID
router.put("/products/:id", updatePostById);
router.delete("/products/:id", deletePostById);


router.post('/tag', createTag);

router.get('/tag', getAllTags);

router.get('/tag/filter/:name', getAllTagsFilter);

router.get('/tag/:id', getTagById);

router.put('/tag/:id', updateTagById);

router.delete('/tag/:id', deleteTagById);



router.post("/add-governor", addGovernor);

router.get("/getUsers", getUsers);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);
router.put("/updateUserStatus/:id", updateAcceptedStatus);
router.post("/addAdmin", addAdmin);
router.post("/createProduct", createPost);

// Route for getting all posts (products)
router.get("/products", getAllPosts);

// Route for updating a post (product) by ID
router.put("/products/:id", updatePostById);
router.delete("/products/:id", deletePostById);

router.post("/category", createCategory);
router.get("/category", getCategories);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

router.get("/complaints", getAllComplaints);
router.get("/getAllRevenue", getTotalRevenue);
router.put("/complaints/:id", updateComplaintById);
router.delete("/deleteByCreator/:creatorId", deletePostsByCreator);
router.delete("/deleteTourGuide/:id", deleteTourGuideAndIterinaries);
router.delete("/deleteAdvertiser/:id", deleteAdvertiserAndActivities);

router.get("/userCounts", getUserCounts); // This will fetch total users and users this month

module.exports = router;
