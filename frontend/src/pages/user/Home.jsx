import MainLayout from "../../layouts/MainLayout";
import Hero from "../../components/common/Hero";
import Categories from "../../components/common/Categories";
import FeaturedProducts from "../../components/common/FeaturedProducts";

function Home() {
  return (
    <MainLayout>
      <Hero />
      <Categories />
      <FeaturedProducts />
    </MainLayout>
  );
}

export default Home;