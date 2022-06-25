import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import { HomeIcon } from "@heroicons/react/solid";
import {
  BellIcon,
  BookmarkIcon,
  ClipboardIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
  HashtagIcon,
  InboxIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { userState } from "../atom/userAtom";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  console.log(currentUser);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(db, "users", auth.currentUser.providerData[0].uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data());
          }
        };
        fetchUser();
      }
    });
  }, []);

  function onSignOut() {
    signOut(auth);
    setCurrentUser(null);
  }
  return (
    <div className="fixed flex-col hidden h-full p-2 sm:flex xl:items-start xl:ml-24">
      {/* Twitter Logo */}
      <div className="p-0 hoverEffect hover:bg-blue-100 xl:px-1">
        <Image
          width="50"
          height="50"
          src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
        ></Image>
      </div>

      {/* Menu */}

      <div className="mt-4 mb-2.5 xl:items-start">
        <SidebarMenuItem text="Home" Icon={HomeIcon} active />
        <SidebarMenuItem text="Explore" Icon={HashtagIcon} />
        {currentUser && (
          <>
            <SidebarMenuItem text="Notifications" Icon={BellIcon} />
            <SidebarMenuItem text="Messages" Icon={InboxIcon} />
            <SidebarMenuItem text="Bookmarks" Icon={BookmarkIcon} />
            <SidebarMenuItem text="Lists" Icon={ClipboardIcon} />
            <SidebarMenuItem text="Profile" Icon={UserIcon} />
            <SidebarMenuItem text="More" Icon={DotsCircleHorizontalIcon} />
          </>
        )}
      </div>

      {/* Button */}

      {currentUser ? (
        <>
          <button className="hidden w-56 h-12 text-lg font-bold text-white bg-blue-400 rounded-full shadow-md hover:brightness-95 xl:inline">
            Tweet
          </button>

          {/* Mini-Profile */}

          <div className="flex items-center justify-center mt-auto text-gray-700 hoverEffect xl:justify-start">
            <img
              onClick={onSignOut}
              src={currentUser?.userImg}
              alt="user-img"
              className="w-10 h-10 rounded-full xl:mr-2"
            />
            <div className="hidden leading-5 xl:inline">
              <h4 className="font-bold">{currentUser?.name}</h4>
              <p className="text-gray-500">@{currentUser?.username}</p>
            </div>
            <DotsHorizontalIcon className="hidden h-5 xl:ml-8 xl:inline" />
          </div>
        </>
      ) : (
        <button
          onClick={() => router.push("/auth/signin")}
          className="hidden h-12 text-lg font-bold text-white bg-blue-400 rounded-full shadow-md w-36 hover:brightness-95 xl:inline"
        >
          Sign in
        </button>
      )}
    </div>
  );
}