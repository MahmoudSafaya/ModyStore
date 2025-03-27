import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <>
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-xl font-semibold text-indigo-600">404</p>
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                        الصفحة غير موجودة
                    </h1>
                    <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <button
                            type='button'
                            name='notfound-btn'
                            onClick={() => navigate(-1)}
                            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            الصفحة السابقة
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default NotFound