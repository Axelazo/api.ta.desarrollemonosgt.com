import Product from "./product";

import User from "./user";

import Warehouse from "./warehouse";

Warehouse.hasMany(Product);

Product.belongsTo(Warehouse);

Product.belongsTo(User);

export { User, Product, Warehouse };
