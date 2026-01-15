import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="bg-white flex items-center justify-center w-full min-h-screen py-8  page md:py-16 ">
      <div className="relative flex flex-col items-center w-full gap-8 px-8 md:px-18 xl:px-40 md:gap-16">
        <h1 className="text-9xl md:text-[300px] w-full select-none  text-center font-black  text-gray-400 dark:text-[#373A40]  ">
          404
        </h1>
        <p className="text-3xl font-bold capitalize">You have discovered a secret place</p>
        <div className="flex flex-col justify-between w-full gap-8 md:flex-row md:gap-32 xl:px-16">
          <Link
            onClick={() => navigate(-1)}
            to="/"
            className="flex items-center justify-center w-full gap-4 p-3 font-semibold capitalize border-2 border-blue-500 rounded shadow-lg md:w-fit hover:bg-blue-500 md:p-6 focus:outline-none hover:scale-105 active:scale-90 hover:shadow-xl "
          >
            Go back to Previous Page
          </Link>
          <Link
            to="/"
            className="rounded flex w-full md:w-fit group items-center gap-4 justify-center border-2 border-[#09C372] font-semibold hover:bg-[#09C372] p-3 md:p-6 capitalize focus:outline-none hover:scale-105 active:scale-90 shadow-lg hover:shadow-xl "
          >
            Go back to Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
