module.exports = {
      module: {
            rules: [
                  {
                        test: /\.less/,
                        use: [
                              "vue-style-loader", 
                              "css-loader", 
                              "less-loader"
                        ],
                  },
                  {
                        teste: /\.svg$/,
                        use: [
                              'babel-loader',
                              'vue-svg-loader',
                        ],
                  },
            ],
      },
};
    