ELEMENT.locale(ELEMENT.lang.ja)
const config = { 
    headers: {  
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*'
    }
}
const post_config = { 
    headers: {  
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*'
    }
}
var app = new Vue({
    el: "#app",
    mounted: function() {
        this.preload();
    },
    data: {
        form: {
            creator: '',
            prob_name: '',
            select_wall: '',
            select_grade: '',
            checked_tags: [],
            fileList: [],
            line_notif: true,
        },
        walls: [],
        grades: [],
        tags: [],
        inputTag: '',
        dialogImageUrl: '',
        dialogVisible: false,
        previewVisible: false,
        inputVisible: false,
        loading: true,

        rules: {
            creator: [
                { max: 30, message: '30文字以内で入力して下さい', trigger: 'blur' },
            ],
            prob_name: [
                { max: 30, message: '30文字以内で入力して下さい', trigger: 'blur' },
            ],
            select_wall: [
                { required: true, message: '傾斜を選択してね', trigger: 'change' },
            ],
            select_grade: [
                { required: true, message: 'グレードを選択してね', trigger: 'change' },
            ],
            fileList: [
                { required: true, message: '画像を選択してね', trigger: 'blur' },
            ]
        }
    },
    methods: {
        preload() {
            this.loading = false;
            axios.get(
                'https://yhbc-jam-api.herokuapp.com/get_formdata',
                //'http://127.0.0.1:5000/problem/get_formdata',
                config,
                )
                .then(response => {
                    var res = response.data
                    this.walls = res[0].walls;
                    this.grades = res[0].grades;
                    this.tags = res[0].tags;
                    this.loading = true;
                })
                .catch(error => {
                    console.log(error.response)
                    this.loading = true;
                    const title = 'データロードエラー' 
                    const mes = 'データの読み込みに失敗しました。もう一度トライしてください';
                    const dur = 5000;
                    this.openErrorNotif(title, mes, dur)
                });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.loading = false;
                var formData = new FormData();
                formData.append('creator', this.form.creator)
                formData.append('problem', this.form.prob_name)
                formData.append('wall', this.form.select_wall)
                formData.append('grade', this.form.select_grade)
                // タグ追加
                for (let index = 0; index < this.form.checked_tags.length; index++) {
                    const element = this.form.checked_tags[index];
                    formData.append('tags' + (index + 1).toString(), element);
                }
                // 画像追加
                for (let index = 0; index < this.form.fileList.length; index++) {
                    const element = this.form.fileList[index];
                    formData.append('images' + (index + 1).toString(), element.raw);
                }
                axios.post(
                    'https://yhbc-jam-api.herokuapp.com/problem/create_problem', 
                    //'http://127.0.0.1:5000/problem/create_problem',
                    formData, 
                    post_config,
                    )
                    .then(response => {
                        const res = response.data
                        this.id = res.id;
                        this.name = res.name;
                        this.loading = true;
                        this.form.checked_tags = [];
                        this.$refs[formName].resetFields();
                        const title = '登録成功' 
                        const mes = '課題の登録に成功しました！';
                        const dur = 5000;
                        this.openSuccessNotif(title, mes, dur);
                    })
                    .catch(error => {
                        console.log(error.response)
                        this.loading = true;
                        const title = '登録エラー' 
                        const mes = '登録に失敗しました。もう一度やり直してください。\n再度失敗するようであれば「滝野」まで連絡願います。';
                        const dur = 5000;
                        this.openErrorNotif(title, mes, dur);
                    });
            } else {
                this.loading = true;
                this.dialogVisible = true;
                const title = 'データ送信エラー' 
                const mes = 'データの送信に失敗しました。未入力の項目を確認し、再度トライしてください。';
                const dur = 5000;
                this.openErrorNotif(title, mes, dur);
                return false;
            }
            });
        },
        handleAdd(file, fileList) {
            this.form.fileList = fileList;
            console.log(file, fileList);
        },
        handleRemove(file, fileList) {
            this.form.fileList = fileList;
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.previewVisible = true;
        },
        handleInputConfirm() {
            let inputTag = this.inputTag;
            if (inputTag) {
                var len = this.tags.length;
                this.tags.push({'id':len + 1, 'name': inputTag});
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
            this.form.select_grade = '';
            this.form.select_wall = '';
            this.form.checked_tags = [];
            this.form.imageUrl = '';
        },
        openSuccessNotif(title, message, duration) {
            this.$notify.success({
                title: title,
                duration: duration,
                message: message
            });
        },
        openErrorNotif(title, message, duration) {
            this.$notify.error({
                title: title,
                duration: duration,
                message: message
            });
        },
    }
});
