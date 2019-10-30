ELEMENT.locale(ELEMENT.lang.ja)
var app = new Vue({
    el: "#app",
    data: {
        form: {
            inputTag: '',
        },
        loading: true,
        inputVisible: false,
        dynamicTags: [],
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                var config = { 
                    headers: {  
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
                this.loading = false;
                axios.post(
                    //'https://yhbc-jam-api.herokuapp.com/create_user', 
                    'http://127.0.0.1:5000/create_tag',
                    this.$data, 
                    config,
                    )
                    .then(response => {
                        const res = response.data
                        this.loading = true;
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.loading = true;
                        this.opneErrorNotif()
                    });
            } else {
                console.log('error submit!!');
                this.loading = true;
                return false;
            }
            });
        },
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputTag = this.form.inputTag;
            if (inputTag) {
                this.dynamicTags.push(inputTag);
            }
            this.inputVisible = false;
            this.inputTag = '';
        },
        opneErrorNotif() {
            this.$notify.error({
                title: 'エラー',
                duration: 5000,
                message: '登録に失敗しました。もう一度やり直してください。\n再度失敗するようであれば「滝野」まで連絡願います。'
            });
        }
    }
});
