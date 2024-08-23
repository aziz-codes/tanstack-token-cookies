"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import TimeAgo from "react-timeago";
import { getRequest, postRequest } from "@/services";

interface Post {
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface ApiResponse {
  count: number;
  result: Post[];
}

const HomePage = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [posting, setPosting] = useState(false);

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<ApiResponse, Error>({
    queryKey: ["posts"],
    queryFn: async () => await getRequest("/posts"),
  });

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
      // Invalidate and refetch posts on success
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setPosting(false);
    },
    onError: (error: Error) => {
      console.error("Error posting data:", error);
      setPosting(false);
    },
  });

  const posts = data?.result;

  return (
    <div className="flex w-full p-6 gap-2">
      <div className="flex-1 flex flex-col gap-4">
        <h4>Create a new post!</h4>
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
          <div
            key={post._id}
            className="flex flex-col space-y-1 border shadow-md rounded-md p-3"
          >
            <h4>{post.title}</h4>
            <p className="line-clamp-3 break-all">{post.description}</p>
            <TimeAgo date={post.createdAt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
