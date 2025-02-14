import { S_Categories, S_HeroSlider } from '../components'
import { S_Products } from '.'

const Home = () => {
  return (
    <div>
        <main>
            {/* <S_HeroSlider /> */}
            <S_Categories />
            <S_Products />
        </main>
    </div>
  )
}

export default Home