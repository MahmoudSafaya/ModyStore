import { S_Categories, S_HeroSlider } from '../components'
import { S_Products } from '.'
import { Toaster } from 'react-hot-toast'

const Home = () => {
  return (
    <div>
        <main>
            <S_HeroSlider />
            <S_Categories />
            <S_Products />
            <Toaster />
        </main>
    </div>
  )
}

export default Home