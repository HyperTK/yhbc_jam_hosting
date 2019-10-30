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
    data: {
        form: {
            creator: '',
            prob_name: '',
            select_wall: '',
            select_grade: '',
            checked_tags: [],
            line_notif: true,
        },
        walls: [],
        grades: [],
        tags: [],
        imageUrl: '',
        inputTag: '',
        dialogVisible: false,
        inputVisible: false,
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
            axios.get(
                //'https://yhbc-jam-api.herokuapp.com' + url, 
                'http://127.0.0.1:5000' + url,
                config,
                )
                .then(response => {
                    var res = response.data
                    this.walls = res[0].walls;
                    this.grades = res[0].grades;
                    this.tags = res[0].tags;
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
                this.loading = false;
                axios.post(
                    'https://yhbc-jam-api.herokuapp.com/create_problem', 
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
        handleInputConfirm() {
            let inputTag = this.inputTag;
            if (inputTag) {
                this.form.checked_tags.push(inputTag);
            }
            this.inputVisible = false;
            this.inputTag = '';
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.select_grade = ''
            this.form.select_wall = ''
            this.form.select_tags = ''

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
