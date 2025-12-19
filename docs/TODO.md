
New react components
 1. <Activity> - wrapper which show / hide elements but remains the state
 2. <Suspense> - loading until promise is resolved ( TanQuery )
 3. <ErrorBoundary> - catch errors in child components and show fallback UI
 4. <Portal> - render children into a DOM node that exists outside the DOM hierarchy of the parent component
 5. <LazyLoad> - load components only when they are visible in viewport
 

Advanced typescript features
 1. Conditional types 
 2. Mapped types
 3. infer
 4. Generics
    5. Utility Types
     a. Exclude - exclude specific types from union (type A = Exclude<"a" | "b" | "c", "a">)
     b. Extract - extract specific types from union (type B = Extract<"a" | "b" | "c", "a" | "c">)
     c. NonNullable - exclude null and undefined from type (type C = NonNullable<string | number | null | undefined>)
     d. Pick - pick specific fields from type (user: Pick<User, "name" | "age")
     d. Omit - remove specific fields from type (user: Omit<User, "password">)
     e. Record - create object type with specific keys and values type (Record<string, number>)
     f. Partial - make all fields optional (user: Partial<User>)
     g. Required - make all fields required (user: Required<User>)
     h. Readonly - make all fields readonly (user: Readonly<User>) - Object.freeze()
     i. ReturnType - get return type of function ()
     j. Parameters - get parameters type of function
     k. keyof - get keys of type as union
     k. Extract - extract specific types from union (type B = Extract<User, "name" | "age">)
     l. Exclude - exclude specific types from union 

