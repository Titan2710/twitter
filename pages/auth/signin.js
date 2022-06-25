import { db } from "../../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
export default function Signin() {
  const router = useRouter();
  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser.providerData[0];
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          username: user.displayName.split(" ").join("").toLocaleLowerCase(),
          userImg: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
      }
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <img
        src="https://cdn.cms-twdigitalassets.com/content/dam/help-twitter/en/twitter-tips/desktop-assets/ch-01/ch12findphone.png.twimg.1920.png"
        alt="twitter image inside a phone"
        className="hidden object-cover md:w-44 md:h-80 rotate-6 md:inline-flex"
      />
      <div className="">
        <div className="flex flex-col items-center">
          <img
            className="object-cover w-36"
            src="https://help.twitter.com/content/dam/help-twitter/brand/logo.png"
            alt="twitter logo"
          />
          <p className="my-10 text-sm italic text-center">
            This app is created for learning purposes
          </p>
          <button
            onClick={onGoogleClick}
            className="p-3 text-white bg-red-400 rounded-lg hover:bg-red-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}