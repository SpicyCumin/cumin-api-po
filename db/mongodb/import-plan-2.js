// Mongo import (terminal)
/*
mongoimport --db=products --collection=products --type=csv --headerline --file=product.csv
mongoimport --db=products --collection=features --type=csv --headerline --file=features.csv
mongoimport --db=products --collection=related --type=csv --headerline --file=related.csv
mongoimport --db=products --collection=styles --type=csv --headerline --file=styles.csv
mongoimport --db=products --collection=skus --type=csv --headerline --file=skus.csv
mongoimport --db=products --collection=photos --type=csv --headerline --file=photos_2.csv
*/


db.products.createIndex({ id: 1 })
db.features.createIndex({ product_id: 1 })
db.related.createIndex({ current_product_id: 1 })
db.styles.createIndex({ id: 1 })
db.skus.createIndex({ styleId: 1}),
db.photos.createIndex({ styleId: 1})

// Test version:
db.products.aggregate([{
  $lookup: {
    from: "features",
    localField: "id",
    foreignField: "product_id",
    as: "features"
  }
}, {
  $unset: ["features._id", "features.id", "features.product_id"]
}])

// Final version:
db.products.aggregate([{
  $lookup: {
    from: "features",
    localField: "id",
    foreignField: "product_id",
    as: "features"
  }
}, {
  $unset: ["features._id", "features.id", "features.product_id"]
}, {
  $merge: "products"
}])



db.products.aggregate([{
  $lookup: {
    from: "related",
    localField: "id",
    foreignField: "current_product_id",
    as: "related"
  }
}, {
  $project: {
    id: 1,
    name: 1,
    slogan: 1,
    description: 1,
    category: 1,
    default_price: 1,
    features: 1,
    related: {
      $map: {
        input: "$related",
        as: "related",
        in: "$$related.related_product_id"
      }
    }
  }
}, {
    $merge: "products"
}])

db.styles.aggregate([{
  $lookup: {
    from: "skus",
    localField: "id",
    foreignField: "styleId",
    as: "skus"
  }
}, {
  $unset: ["skus._id", "skus.id", "skus.styleId"]
}, {
  $merge: "styles"
}])

db.styles.aggregate([{
  $lookup: {
    from: "photos",
    localField: "id",
    foreignField: "styleId",
    as: "photos"
  }
}, {
  $unset: ["photos._id", "photos.id", "photos.styleId"]
}, {
  $merge: "styles"
}])




// Merging styles into products... is it a good idea?
db.styles.createIndex({ productId: 1 })

db.products.aggregate([{
  $lookup: {
    from: "styles",
    localField: "id",
    foreignField: "productId",
    as: "styles"
  }
}, {
  $unset: ["styles._id", "styles.id", "styles.productId"]
}, {
  $merge: "products"
}]);