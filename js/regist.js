//ELEMENT.locale(ELEMENT.lang.ja)
var app = new Vue({
    el: "#app",
    data: {
        form: {
            last_name: '',
            first_name: '',
            last_kana: '',
            first_kana: '',
            birth: '',
            phone: '',
            email: '',
        },
        dialogVisible: false,
        registedDialog: false,
        loading: true,

        rules: {
            last_name: [
                {required: true, message: '姓を入力してください', trigger: 'blur'}
            ],
            first_name: [
                {required: true, message: '名を入力してください', trigger: 'blur'}
            ],
            last_kana: [
                {required: true, message: '姓(カナ)を入力してください', trigger: 'blur'}
            ],
            first_kana: [
                {required: true, message: '名(カナ)を入力してください', trigger: 'blur'}
            ],
            birth: [
                {required: true, message: '生年月日を入力してください', trigger: 'change'}
            ],
            phone: [
                {required: true, message: '電話番号を入力してください', trigger: 'blur'}
            ],

        }
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
                //alert('submit!');
                this.loading = false;
                axios.post(
                    'https://yhbc-jam-api.herokuapp.com/create_user', 
                    //'http://127.0.0.1:5000/create_user',
                    this.$data, 
                    config,
                    )
                    //'/create_user', this.$date)
                    .then(response => {
                        console.log(response.data)
                        this.loading = true;
                        this.registedDialog = true;
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.loading = true;
                        
                    });
                //this.$refs[formName].resetFields();
            } else {
                console.log('error submit!!');
                this.loading = true;
                this.registedDialog = true;
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClose(done) {
            this.$confirm('登録をキャンセルしますか？')
            .then(_ => {
            done();
            })
            .catch(_ => {});
        }
    }
});
