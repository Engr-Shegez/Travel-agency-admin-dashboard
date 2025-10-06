import { Header } from "components";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import React from "react";
// constants.users import removed; we fetch real users from Appwrite
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/all-users";

// Use client-side loader to leverage the authenticated browser session
export const clientLoader = async () => {
  // Ensure current user exists/is created; ignore returned value here
  try {
    // Lazy import to avoid circular types if any
    const { getUser } = await import("~/appwrite/auth");
    await getUser();
  } catch {}

  const { users, total } = await getAllUsers(10, 0);
  return { users, total };
};

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  const { users } = loaderData;

  console.log("AllUsers component - loaderData:", loaderData);
  console.log("AllUsers component - users:", users);

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, Sort, and access detailed user Profiles"
      />
      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(props: any) => {
              // Syncfusion may pass either the full row object or the cell value depending on setup.
              // Be defensive: if props is a string, treat it as the image src; otherwise try common fields.
              const src =
                typeof props === "string"
                  ? props
                  : props?.imageUrl ||
                    props?.ImageUrl ||
                    props?.photo ||
                    (props && props["imageUrl"]);
              const name = (props && (props.name || props.Name)) || "User";

              return (
                <div className="flex items-center gap-2 px-4">
                  <img
                    src={src}
                    alt={name}
                    className="rounded-full w-8 h-8 object-cover"
                  />
                  <span className="truncate text-sm">{name}</span>
                </div>
              );
            }}
          />
          <ColumnDirective
            field="email"
            headerText="Email Address"
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width="140"
            textAlign="Left"
            template={({ joinedAt }: { joinedAt: string }) =>
              formatDate(joinedAt)
            }
          />
          {/* <ColumnDirective
            field="itineraryCreated"
            headerText="Trip Created"
            width="130"
            textAlign="Left"
          /> */}
          <ColumnDirective
            field="status"
            headerText="Type"
            width="100"
            textAlign="Left"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "user" ? "bg-success-50" : "bg-light-300"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "user" ? "bg-success-500" : "bg-gray-500"
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    status === "user" ? "text-success-700" : "text-gray-500"
                  )}
                >
                  {status}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
};
export default AllUsers;
