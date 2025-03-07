import BeatLoader from "react-spinners/BeatLoader";

const Loading = ({ loading }) => {
    return (
        <div className="w-screen h-screen fixed top-0 left-0 z-200 bg-white flex items-center justify-center">
            <BeatLoader
                loading={loading}
                color={'oklch(0.585 0.233 277.117)'}
                size={25}
            />
        </div>
    )
}


export default Loading;
