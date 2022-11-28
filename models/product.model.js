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
}

module.exports = Product;
