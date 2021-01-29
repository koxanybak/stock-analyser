const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== "development" && NODE_ENV !== "production" && NODE_ENV !== "test") {
    throw Error(`Expect NODE_ENV to be specified. Instead got: ${NODE_ENV}`);
}

export { NODE_ENV };