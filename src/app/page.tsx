"use client";

import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsername } from "@/hooks/use-username";
import { Suspense, useState } from "react";

export default function Page() {
  return (
    <Suspense>
      <Lobby />;
    </Suspense>
  );
}

function Lobby() {
  const { username } = useUsername();
  const router = useRouter();

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const [mins, setMins] = useState<number>(10);
  const [errorMins, setErrorMins] = useState<string>("");

  const { mutate: createRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post({ ttl: mins });

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      } else if (res.status === 422) {
        setErrorMins(res.error?.value.message as string);
      }
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {errorMins !== "" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">
              CAN&apos;T CREATE A ROOM
            </p>
            <p className="text-zinc-500 text-xs mt-1">{errorMins}</p>
          </div>
        )}
        {wasDestroyed && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM DESTROYED</p>
            <p className="text-zinc-500 text-xs mt-1">
              All messages were permanently deleted.
            </p>
          </div>
        )}
        {error === "room-not-found" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM NOT FOUND</p>
            <p className="text-zinc-500 text-xs mt-1">
              This room may have expired or never existed.
            </p>
          </div>
        )}
        {error === "room-full" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-bold">ROOM FULL</p>
            <p className="text-zinc-500 text-xs mt-1">
              This room is at maximum capacity.
            </p>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {">"}private_chat
          </h1>
          <p className="text-zinc-500 text-sm">
            A private, self-destructing chat room.
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <label className="flex-3 items-center text-zinc-500">
                  Your Identity
                </label>
                <label className="flex-1 text-zinc-500">Mins</label>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                  {username}
                </div>
                <div
                  className={`bg-zinc-950 border  p-3 text-sm text-zinc-400 font-mono w-1/4 ${
                    errorMins !== "" ? "border-red-500" : "border-zinc-800"
                  }`}
                >
                  <input
                    value={mins}
                    onChange={(e) => setMins(parseInt(e.target.value))}
                    type="number"
                    className="w-full outline-none placeholder:text-center text-center"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => createRoom()}
              className="w-full bg-zinc-100 text-black p-3 text-sm font-bold hover:bg-zinc-50 hover:text-black transition-colors mt-2 cursor-pointer disabled:opacity-50"
            >
              CREATE SECURE ROOM
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
