class User{
    private id:number;
    private name:string;
    private email:string;
    private isLogged:boolean;

    constructor(id:number, name:string, email:string, isLogged:boolean){
        this.id= id;
        this.name = name;
        this.email=email;
        this.isLogged=isLogged;
    }
    public printInfo():void{
        console.log(this.name + " - " + this.isLogged)
    }
    public setIsLogged(isLogged:boolean):void{
        this.isLogged=isLogged;
    }
    public getIsLogged():boolean{
        return this.isLogged;
    }
    public setEmail(email:string):void{
        this.email=email;
    }
    public getEmail():string{
        return this.email;
    }
    public setName(name:string):void{
        this.name=name;
    }
    public getName():string{
        return this.name;
    }
    public setId(id:number):void{
        this.id=id;
    }
    public getId():number{
        return this.id;
    }
}