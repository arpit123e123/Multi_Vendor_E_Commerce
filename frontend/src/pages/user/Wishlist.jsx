import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import MainLayout from "../../layouts/MainLayout";


function Wishlist() {

  const dispatch = useDispatch();


  const { items, loading } = useSelector(
    (state) => state.wishlist
  );


  useEffect(() => {

    dispatch(getWishlist());

  }, [dispatch]);



  const handleRemove = (id) => {

    dispatch(removeFromWishlist(id));

    toast.success("Removed from wishlist");

  };



  const handleAddToCart = (id) => {

    dispatch(
      addToCart({
        productId: id,
        quantity: 1,
      })
    );

    toast.success("Added to cart");

  };



  return (

    <MainLayout>

      <div className="max-w-7xl mx-auto px-6 py-10">


        <h1 className="text-3xl font-bold mb-8">
          My Wishlist ❤️
        </h1>



        {loading ? (

          <p>Loading...</p>

        ) : items.length === 0 ? (

          <div className="text-center text-gray-500">

            Wishlist is empty

          </div>

        ) : (


          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">


            {items.map((product)=>(


              <div
                key={product._id}
                className="bg-white rounded-xl shadow p-4"
              >


                <img

                  src={
                    product.images?.[0] ||
                    "https://via.placeholder.com/300"
                  }

                  alt={product.name}

                  className="w-full h-48 object-cover rounded-lg"

                />



                <h2 className="font-bold text-lg mt-4">

                  {product.name}

                </h2>



                <p className="text-blue-600 font-bold mt-2">

                  ₹{product.price}

                </p>



                <div className="flex gap-2 mt-4">


                  <button

                    onClick={() =>
                      handleAddToCart(product._id)
                    }

                    className="flex-1 bg-blue-600 text-white py-2 rounded"

                  >

                    Cart

                  </button>



                  <button

                    onClick={() =>
                      handleRemove(product._id)
                    }

                    className="flex-1 bg-red-500 text-white py-2 rounded"

                  >

                    Remove

                  </button>


                </div>



                <Link

                  to={`/products/${product._id}`}

                  className="block text-center mt-3 bg-gray-800 text-white py-2 rounded"

                >

                  View

                </Link>



              </div>


            ))}


          </div>


        )}


      </div>


    </MainLayout>

  );

}


export default Wishlist;