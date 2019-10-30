ELEMENT.locale(ELEMENT.lang.ja)
var app = new Vue({
    el: "#app",
    data: {
        form: {
            creator: '',
            prob_name: '',
            select_wall: '',
            select_grade: '',
            line_notif: '',
        },
        walls: [],
        grades: [],
        imageUrl: '',
        dialogVisible: false,
        registedDialog: false,
        loading: true,

        rules: {
            creator: [
                { max: 30, message: '30文字以内で入力して下さい', trigger: 'blur' }
            ],
            prob_name: [
                { max: 30, message: '30文字以内で入力して下さい', trigger: 'blur' }
            ],
        }
    },
    mounted: function() {
        this.api("/get_formdata")
    },
    methods: {
        api(url) {
            this.loading = false;
            var config = { 
                headers: {  
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Access-Control-Allow-Origin': '*'
                }
            }
            axios.get(
                //'https://yhbc-jam-api.herokuapp.com/' + url, 
                'http://127.0.0.1:5000' + url,
                config,
                )
                .then(response => {
                    var res = response.data
                    this.walls = res[0].walls;
                    this.grades = res[0].grades;
                    this.loading = true;
                    this.registedDialog = true;
                })
                .catch(error => {
                    console.log(error.response)
                    this.loading = true;
                    this.opneErrorNotif();
                });
        },
        handleProblemSuccess(res, file) {
            console.log(file.raw)
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        beforeProblemUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';

            if(!isJPG && !isPNG) {
                this.$message.error('写真はJPEGかPNGでアップロードしてください');
            }
            return isJPG || isPNG;
        },
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
                    .then(response => {
                        const res = response.data
                        this.id = res.id
                        this.name = res.name

                        this.loading = true;
                        this.registedDialog = true;
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.loading = true;
                        this.opneErrorNotif()
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
