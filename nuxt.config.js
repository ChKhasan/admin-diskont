export default {
  router: {
    extendRoutes(routes) {
      routes.push({
        path: "/admin/login",
        component: "~/pages/admin/login.vue",
      });
    },
  },
  head: {
    title: "E-shop admin panel",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    // link: [{ rel: "icon", type: "image/jpg", href: "/logo.jpg" }],
  },
  css: [
    "~/assets/scss/app.scss",
    "~/assets/scss/custom/page/_app-styles.scss",
    "~/assets/fonts/stylesheet.css",
  ],

  plugins: [
    { src: "~plugins/element-ui.js", ssr: false },
    { src: "~plugins/quill-editor.js", ssr: false },
    { src: "~plugins/antd-ui.js", ssr: false },
    { src: "~plugins/v-mask.js", ssr: false },
  ],
  axios: {
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true;
    },
    baseURL: process.env.BASE_URL,
    // baseURL: "https://api.e-shop.ndc.uz/api/admin",
  },
  components: true,

  buildModules: ["@nuxtjs/svg", "@nuxt/postcss8", "@nuxtjs/dotenv"],

  modules: [
    "bootstrap-vue/nuxt",
    "@nuxtjs/axios",
    // "@nuxtjs/auth",
    "@nuxtjs/dotenv",
    "nuxt-precompress",
    "@nuxt/image",
  ],
  ssr: false,
  build: {
    analyze: true,
  },
  loadingIndicator: {
    name: "chasing-dots",
    color: "#1890ff",
    background: "white",
  },
  // auth: {
  //   strategies: {
  //     local: {
  //       scheme: "refresh",
  //       token: {
  //         property: "access",
  //         maxAge: 60 * 60 * 2,
  //       },
  //       refreshToken: {
  //         property: "refresh",
  //         data: "refresh",
  //         maxAge: 60 * 60 * 24,
  //       },
  //       user: {
  //         property: false,
  //       },
  //       endpoints: {
  //         login: {
  //           url: "/api/account/login",
  //           method: "post",
  //           propertyName: "access",
  //         },
  //         refresh: { url: "/api/auth/refresh", method: "post" },
  //         logout: { url: "/api/account/logout", method: "post" },
  //         user: false,
  //       },
  //     },
  //   },
  //   redirect: {
  //     login: "/admin/login",
  //     logout: "/admin/login",
  //     callback: "/admin/login",
  //     home: "/catalog/products",
  //   },
  //   watchLoggedIn: true,
  // },
  nuxtPrecompress: {
    enabled: true, // Enable in production
    report: false, // set true to turn one console messages during module init
    test: /\.(js|css|html|txt|xml|svg)$/, // files to compress on build
    middleware: {
      enabled: true,
      enabledStatic: true,
      encodingsPriority: ["br", "gzip"],
    },
    gzip: {
      enabled: true,
      filename: "[path].gz[query]",
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 },
    },
    brotli: {
      enabled: true,
      filename: "[path].br[query]",
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
    },
  },
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
};
