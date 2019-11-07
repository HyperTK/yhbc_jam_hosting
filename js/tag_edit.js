ELEMENT.locale(ELEMENT.lang.ja)
const config = { 
    headers: {  
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*'
    }
}
var app = new Vue({
    el: "#app",
    mounted: function() {
        this.getTags();
    } ,
    data: {
        form: {
            dynamicTags: [],
        },
        inputTag: '',
        registedTags: [],
        loading: true,
        inputVisible: false,
    },
    methods: {
        trigger: (event) => {
            // 日本語入力中のEnterキー操作を無効にする
            if(event.keyCode !== 13) return
        },
        // フォーム送信
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.loading = false;
                axios.post(
                    //'https://yhbc-jam-api.herokuapp.com/create_user', 
                    'http://127.0.0.1:5000/tag/create_tag',
                    this.$data, 
                    config,
                    )
                    .then(response => {
                        this.registedTags = response.data;
                        this.loading = true;
                        this.form.dynamicTags = '';
                        this.openRegistNotif();
                    })
                    .catch(error => {
                        console.log(error.response);
                        this.loading = true;
                        this.openErrorNotif();
                    });
            } else {
                console.log('error submit!!');
                this.loading = true;
                return false;
            }
            });
        },
        // タグ取得
        getTags() {
            this.loading = false;
            axios.get(
                //'https://yhbc-jam-api.herokuapp.com//get_tags', 
                'http://127.0.0.1:5000/tag/get_tags',
                this.$data, 
                config,
                )
                .then(response => {
                    this.registedTags = response.data
                    this.loading = true;
                })
                .catch(error => {
                    console.log(error.response)
                    this.loading = true;
                    this.openErrorNotif()
                });
        },
        handleClose(tag) {
            this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1);
        },
        handleDelete(tag) {
            axios.post(
                //'https://yhbc-jam-api.herokuapp.com//get_tags', 
                'http://127.0.0.1:5000/tag/delete_tag',
                tag,
                config,
                )
                .then(response => {
                    this.registedTags = response.data
                    this.loading = true;
                    this.openDeleteNotif()
                })
                .catch(error => {
                    console.log(error.response)
                    this.loading = true;
                    this.openErrorNotif()
                });
            this.registedTags.splice(this.registedTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputTag = this.inputTag;
            if (inputTag) {
                this.form.dynamicTags.push(inputTag);
            }
            this.inputVisible = false;
            this.inputTag = '';
        },
        openRegistNotif() {
            this.$notify.success({
                title: '登録OK',
                duration: 2000,
                message: 'タグを登録しました！'
            });
        },
        openDeleteNotif() {
            this.$notify.success({
                title: '削除OK',
                duration: 2000,
                message: 'タグを削除しました！'
            });
        },
        openErrorNotif() {
            this.$notify.error({
                title: 'エラー',
                duration: 5000,
                message: '登録に失敗しました。再読み込みしてもう一度やり直してください'
            });
        }
    }
});
