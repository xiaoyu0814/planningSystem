<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() { },
  methods: {},
};
</script>

<style scoped>
@import "./assets/css/common.css";

html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<style>
#app .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #9fcbfd;
}

#app .tree_menu .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background-color: #9fcbfd;
}

#app .el-tree,
.el-input__inner {
  background-color: rgba(255, 255, 255, 0.0);
}

#app .el-menu--horizontal>.el-submenu .el-submenu__title {
  height: 40px;
  line-height: 40px;
  font-weight: bold;
}

body .el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-submenu__title {
  height: 30px;
  line-height: 30px;
}
</style>