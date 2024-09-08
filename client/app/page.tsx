"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TimeAgo from "react-timeago";
import { getRequest, postRequest, putRequest } from "@/services";
import { logout } from "@/actions/remove-cookie";
import { HeartIcon } from "@heroicons/react/16/solid";

interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
  likes: string[]; // Add likes array
}

interface ApiResponse {
  count: number;
  result: Post[];
}

const HomePage = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [posting, setPosting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = localStorage.getItem("user");

  // Fetching posts
  const { data, error, isLoading } = useQuery<ApiResponse, Error>({
    queryKey: ["posts"],
    queryFn: async () => await getRequest("/posts"),
  });

  // Mutation to create a new post
  const mutation = useMutation({
    mutationFn: async () => {
      setPosting(true);
      const payload = {
        title,
        description: desc,
      };
      await postRequest("/posts", payload);
      setPosting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refetch posts after adding new one
      setPosting(false);
    },
    onError: (error: Error) => {
      console.error("Error posting data:", error);
      setPosting(false);
    },
  });

  // Mutation to like a post
  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const payload = { user }; // Replace with the actual user ID
      await putRequest(`/posts/${postId}/like`, payload);
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<ApiResponse>(["posts"]);

      queryClient.setQueryData<ApiResponse>(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          result: oldData.result.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: [...post.likes, user as string], // Optimistically add user to likes
                }
              : post
          ),
        };
      });

      return { previousPosts };
    },
    onError: (error, postId, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Mutation to dislike a post
  const dislikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const payload = { user }; // Replace with the actual user ID
      await putRequest(`/posts/${postId}/like`, payload);
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData<ApiResponse>(["posts"]);

      queryClient.setQueryData<ApiResponse>(["posts"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          result: oldData.result.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.filter((like) => like !== user) // Optimistically remove user from likes
                }
              : post
          ),
        };
      });

      return { previousPosts };
    },
    onError: (error, postId, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Handle like button click
  const handleLike = (postId: string) => {
    if (posts?.find((post) => post._id === postId)?.likes.includes(user as string)) {
      dislikeMutation.mutate(postId);
    } else {
      likeMutation.mutate(postId);
    }
  };

  const handleClick = async () => {
    await logout();
    router.push("/login");
  };

  const posts = data?.result;

  return (
    <>
      <div className="h-14 w-full border-b mb-4 flex justify-end items-center px-4">
        <button
          onClick={handleClick}
          className="px-3 py-1.5 text-white rounded-md bg-sky-500 border-none outline-none hover:ring-1"
        >
          Logout
        </button>
      </div>
      <div className="flex w-full p-6 gap-2">
        <div className="flex-1 flex flex-col gap-4">
          <h4>Create a new post!</h4> with user {user}
          <input
            type="text"
            className="outline-none px-2 py-2 rounded-md border"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Post Description"
            className="outline-none border px-2 rounded-md"
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <button
            className="bg-sky-500 text-white rounded-md border-none py-2 w-1/2 mx-auto hover:bg-sky-600"
            onClick={() => mutation.mutate()}
            disabled={posting}
          >
            {posting ? "Posting..." : "Add Post"}
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-4 max-h-screen overflow-auto">
          {isLoading && "Loading..."}
          {error && "Error occurred, fetching posts."}
          {posts?.map((post) => (
            <div key={post._id} className="flex flex-col gap-3 shadow-md rounded-md p-3 border">
              <div className="flex flex-col space-y-1">
                <h4 className="font-semibold">{post.title}</h4>
                <p className="line-clamp-3 break-all">{post.description}</p>
                <div className="text-gray-400 text-sm">

                <TimeAgo date={post.createdAt} locale="en-US" timeStyle="round-minute"  />
                </div>
                
              </div>
              <div className="flex items-center gap-2">
                <HeartIcon
                  className="h-10 w-9 cursor-pointer"
                  fill={post.likes.includes(user as string) ? "red" : "gray"}
                  onClick={() => handleLike(post._id)}
                />
                {post.likes.length} Likes
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
