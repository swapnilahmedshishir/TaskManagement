import { Link } from "react-router-dom";

const Erro = () => {
  return (
    <>
      <div className="erro_page_div h-screen   bg-gray-700 text-white shadow-md">
        <div className="container text-center">
          <div className="erro_text_div font-montserrat text-white">
            <strong className="text-[10rem] lg:text-[17rem]">404</strong>
            <h5 className="pt-10 lg:pt-3">
              The Page Your are <br /> Looking for doesn&#39;t exist
            </h5>
            <Link to="/">
              <button className="btn btn-wide custombtn"> Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Erro;
