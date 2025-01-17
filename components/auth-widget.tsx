import {useEffect, useRef, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {UserCircleIcon} from "@heroicons/react/solid";
import Link from "next/link";

function AuthWidget() {
  const {user, isAuthenticated, logout, loginWithRedirect} = useAuth0();
  const [menuVisible, setMenuVisible] = useState(false);
  const ref = useRef(null);
  const [, setShowFallbackIcon] = useState(false);

  const onClickOutside = () => setMenuVisible(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return (
    <div className="fixed right-5 top-5 z-20">
      {isAuthenticated ? (
        <div
          ref={ref}
          className="flex flex-col items-center bg-white w-44 pl-4 rounded-3xl drop-shadow-2xl cursor-pointer"
          onClick={() => setMenuVisible(!menuVisible)}
        >
          <div className="flex gap-3 items-center justify-end">
            <span className="text-md font-bold text-gray-700">Salut, {user.given_name}! </span>
            <button
              className="h-10 w-10 text-green-600"
            >
              {setShowFallbackIcon ? (
                <UserCircleIcon />
              ) : (
                <picture>
                  <source srcSet={user.picture} type="image/jpeg" />
                  <img
                    alt="The profile image from your social account you logged in with (Google etc.)"
                    className="rounded-full"
                    src={user.picture}
                    onError={() => setShowFallbackIcon(true)}
                  />
                </picture>
              )}
            </button>
          </div>
          {
            menuVisible &&
            <div
              className={`z-10 mt-2 bg-white drop-shadow-2xl rounded divide-y w-44 transition
                opacity-0 ${menuVisible && "opacity-100"}`}
              onBlur={() => setMenuVisible(false)}
            >
              <ul className="py-1 text-md list-none">
                <li>
                  <Link href="/my-communities" className="block px-4 py-2 hover:bg-gray-100">Comunităţile mele</Link>
                </li>
                <li>
                  <Link href="/admins-code-of-conduct" className="block px-4 py-2 hover:bg-gray-100">Code of conduct</Link>
                </li>
                <li>
                  <a
                    onClick={() =>
                      logout({
                        returnTo: process.env.NEXT_PUBLIC_WEB_APP_BASE_URL,
                      })
                    }
                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-800"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          }
        </div>
      ) : (
        <button className="flex items-center gap-1 mr-3 bg-white pl-4 pr-1 rounded-3xl drop-shadow-2xl" onClick={loginWithRedirect}>
          <span className="text-md font-bold text-gray-600">Login</span>
          <UserCircleIcon className="h-10 w-10 text-gray-400" />
        </button>
      )}
    </div>
  );
}

export default AuthWidget;
