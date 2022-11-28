const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  //We expect a product data object
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    //We want to store product data as an integer, not string. The + converts it.
    this.description = productData.description;
    this.image = productData.image; // the name of the image file
    //When a product is first created it isn't neccessarily in the database so might not have an id (i think)
    if (productData._id) {
      this.id = productData._id.toString();
    }
  }



  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      description: this.description,
      image: this.image,
    };


    //if the id already exists, then we are simply updating an existing product (document)
    if (this.id) {
      const productId = new mongodb.ObjectId(this.id);

      //if the user isn't updating the image, then we delete the productData.image
      // keyvalue pair from the productData object. This means when the document is updated below
      //mongodb wont try to update that key value pair (it will just remain the old image in the database)
      if (!this.image) {
        delete productData.image;
      }
      
      //update the product with the gievn id with the new product data
      await db.getDb().collection('products').updateOne(
        { _id: productId },
        {
          $set: productData,
        }
      );
      //if no id exists yet, this is a new product and we are creating a new document 
    } else {
      await db.getDb().collection('products').insertOne(productData);
    }
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({ _id: productId });
  }

    //Find any product with this id if it exists
    static async findById(productId) {
      let prodId;
      try {
        //try create the mongodb docuent id. This may not exist ans so fail
        prodId = new mongodb.ObjectId(productId);
      } catch (error) {
        error.code = 404;
        throw error;
      }
  
      // At this point it must exist so retreive the product document
      const product = await db
        .getDb()
        .collection("products")
        .findOne({ _id: prodId });
  
      if (!product) {
        const error = new Error("Could not find product with provided id.");
        error.code = 404;
        throw error;
      }
      //create the product object from the document and return it
      return new Product(product);
    }
  
    // Find all the prducts in the db
    static async findAll() {
      const products = await db.getDb().collection("products").find().toArray();
      //we want to return an array of the product objects, but right now we have an array of the DOCUMENTS.
      //the map function for arrays can deal with this. We just give it a function telling it out to treat each element
      //of the array, i.e create a product object for it.
  
      return products.map(function (productDocument) {
        return new Product(productDocument);
      });
    }
}

module.exports = Product;
