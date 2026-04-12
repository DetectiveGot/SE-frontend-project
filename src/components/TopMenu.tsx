import { getServerSession } from "next-auth";
import TopMenuItem from "./TopMenuItem";
import { authOptions } from "@/lib/auth";

export default async function TopMenu() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    // console.log(user);
    return (
  <ul className="h-[150px] flex justify-end items-center px-15 gap-4">
    <TopMenuItem title="HOME" pageRef="/" cstart="#E8D9D9" cend="#3A231E"/>
    <TopMenuItem title="RESTAURANT" pageRef="/restaurants" cstart="#988E53" cend="#649E70"/>
    <TopMenuItem title="RESERVE" pageRef="/reservations"  cstart="#272727" cend="#BEBEBE" />
    {!user && (
      <>
        <TopMenuItem title="REGISTER" pageRef="/register"  cstart="#686A93" cend="#C7D2FF" />
        <TopMenuItem title="LOGIN" pageRef="/api/auth/signin"  cstart="#BBAABF" cend="#CD8181" />
      </>
    )}
    {user && (
      <div className="relative flex flex-col h-full justify-center items-center">
      <TopMenuItem title="LOGOUT" pageRef="/api/auth/signout"  cstart="#BBAABF" cend="#CD8181" />
      <h1 className="bottom-2 right-3 absolute font-bold">{user.name}</h1>
      </div>
    )}
  </ul>
);

}