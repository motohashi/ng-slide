/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module "*.html" {
    const content: string;
    export default content;
}

declare module "*.json" {
  const value: string;
  export default value;
}