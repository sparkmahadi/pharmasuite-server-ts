export interface IProduct {
    generic_name: string[];
    images: { img: string }[];
    inventory: {
      discount: string;
      item_variation_option_id: number;
      variation_option_id: number;
      price: number;
      regular_price: number;
      variation_option_name: string;
      qty_in_pcs: number;
      stock_qty: number;
      capacity: string;
    }[];
    cat_id: string;
    cat_name: string,
    manufacturers: string;
    manufacturers_alias: string;
    sku_type: string;
    item_type: string;
    is_showcasing: number;
    _id: string;
    item_name: string;
    alias: string;
    path: string;
  }
  