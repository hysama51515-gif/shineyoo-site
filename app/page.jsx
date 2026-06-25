import BrandStory from '../components/BrandStory';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedProducts from '../components/FeaturedProducts';

export default function Home() {
  return (
    <>
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStory />
    </>
  );
}
