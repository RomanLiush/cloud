import { HttpException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../../user/DTO";
import { UserService } from "../../user/services";
import { hash, compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/modules/user/schemas";
import { LoginDTO } from "../DTO";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService
  ) {
  }

  async registration(newUser: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(newUser.email);
    if (candidate) {
      throw new HttpException("There is user with current email.", 400);
    }
    const hashPassword = await hash(newUser.password, 5);
    const created = await this.userService.createUser({
      ...newUser,
      password: hashPassword
    });

    return this.generateToken(created);
  }
  async login(params: LoginDTO) {
    const user = await this.validateUser(params);
    return this.generateToken(user);
  }


  async generateToken(user: User) {
    const payload = { email: user.email, id: user._id };
    return { token: this.jwtService.sign(payload) };
  }

  private async validateUser(params: LoginDTO) {

    const user = await this.userService.getUserByEmail(params.email);

    if (!user) {
      throw new HttpException("Invalid email or password", 400);
    }

    const passwordEqual = await compare(params.password, user.password);

    if (passwordEqual) {
      return user;
    }

    throw new HttpException("Invalid email or password", 400);
  }
}
