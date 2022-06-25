import {
    ChartBarIcon,
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    TrashIcon,
  } from "@heroicons/react/outline";
  import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
  import Moment from "react-moment";
  import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
  } from "firebase/firestore";
  import { db, storage } from "../firebase";
  
  import { useState, useEffect } from "react";
  import { deleteObject, ref } from "firebase/storage";
  import { useRecoilState } from "recoil";
  import { modalState, postIdState } from "../atom/modalAtom";
  import { useRouter } from "next/router";
  import { userState } from "../atom/userAtom";
  
  export default function Post({ post, id }) {
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [open, setOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [currentUser] = useRecoilState(userState);
    const router = useRouter();
  
    useEffect(() => {
      const unsubscribe = onSnapshot(
        collection(db, "posts", id, "likes"),
        (snapshot) => setLikes(snapshot.docs)
      );
    }, [db]);
  
    useEffect(() => {
      const unsubscribe = onSnapshot(
        collection(db, "posts", id, "comments"),
        (snapshot) => setComments(snapshot.docs)
      );
    }, [db]);
  
    useEffect(() => {
      setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
    }, [likes, currentUser]);
  
    async function likePost() {
      if (currentUser) {
        if (hasLiked) {
          await deleteDoc(doc(db, "posts", id, "likes", currentUser?.uid));
        } else {
          await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
            username: currentUser?.username,
          });
        }
      } else {
        // signIn();
        router.push("/auth/signin");
      }
    }
  
    async function deletePost() {
      if (window.confirm("Are you sure you want to delete this post?")) {
        deleteDoc(doc(db, "posts", id));
        if (post.data().image) {
          deleteObject(ref(storage, `posts/${id}/image`));
        }
        router.push("/");
      }
    }
  
    return (
      <div className="flex p-3 border-b border-gray-200 cursor-pointer">
        {/* user image */}
        <img
          className="mr-4 rounded-full h-11 w-11"
          src={post?.data()?.userImg}
          alt="user-img"
        />
        {/* right side */}
        <div className="flex-1">
          {/* Header */}
  
          <div className="flex items-center justify-between">
            {/* post user info */}
            <div className="flex items-center space-x-1 whitespace-nowrap">
              <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {post?.data()?.name}
              </h4>
              <span className="text-sm sm:text-[15px]">
                @{post?.data()?.username} -{" "}
              </span>
              <span className="text-sm sm:text-[15px] hover:underline">
                <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
              </span>
            </div>
  
            {/* dot icon */}
            <DotsHorizontalIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500 " />
          </div>
  
          {/* post text */}
  
          <p
            onClick={() => router.push(`/posts/${id}`)}
            className="text-gray-800 text-[15px sm:text-[16px] mb-2"
          >
            {post?.data()?.text}
          </p>
  
          {/* post image */}
  
          <img
            onClick={() => router.push(`/posts/${id}`)}
            className="mr-2 rounded-2xl"
            src={post?.data()?.image}
            alt=""
          />
  
          {/* icons */}
  
          <div className="flex justify-between p-2 text-gray-500">
            <div className="flex items-center select-none">
              <ChatIcon
                onClick={() => {
                  if (!currentUser) {
                    // signIn();
                    router.push("/auth/signin");
                  } else {
                    setPostId(id);
                    setOpen(!open);
                  }
                }}
                className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100"
              />
              {comments.length > 0 && (
                <span className="text-sm">{comments.length}</span>
              )}
            </div>
            {currentUser?.uid === post?.data()?.id && (
              <TrashIcon
                onClick={deletePost}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
              />
            )}
            <div className="flex items-center">
              {hasLiked ? (
                <HeartIconFilled
                  onClick={likePost}
                  className="p-2 text-red-600 h-9 w-9 hoverEffect hover:bg-red-100"
                />
              ) : (
                <HeartIcon
                  onClick={likePost}
                  className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
                />
              )}
              {likes.length > 0 && (
                <span
                  className={`${hasLiked && "text-red-600"} text-sm select-none`}
                >
                  {" "}
                  {likes.length}
                </span>
              )}
            </div>
  
            <ShareIcon className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
            <ChartBarIcon className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
          </div>
        </div>
      </div>
    );
  }