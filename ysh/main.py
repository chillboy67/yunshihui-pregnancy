from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
from typing import Optional

app = FastAPI()

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应更严格
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 连接 MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client.db_ysh  # 选择数据库
users_collection = db.users  # 选择集合
analysis_history_collection = db.analysis_history # 选择历史记录集合

# Pydantic 数据模型
class UserProfile(BaseModel):
    age: Optional[int] = None
    last_menstrual_date: Optional[str] = None  # 存储为字符串格式的日期
    activity_level: Optional[str] = None  # 低、中、高

class User(BaseModel):
    username: str
    password: str
    security_question_answer: str
    profile: Optional[UserProfile] = None  # 不初始化 profile，允许为空

# 登录用 Pydantic 数据模型
class Login(BaseModel):
    username: str
    password: str

# 修改密码请求数据模型
class PasswordRecovery(BaseModel):
    username: str
    security_question_answer: str
    new_password: str

# 更新用户资料请求模型
class UpdateProfileRequest(BaseModel):
    username: str
    profile: UserProfile

# 单个食物项模型 (用于 analysis_history)
class FoodItem(BaseModel):
    name: str
    amount: int
    mealType: str
    # 包含所有前端可能发送的营养素字段，设为可选
    energy: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    carbohydrate: Optional[float] = None
    fiber: Optional[float] = None
    vitaminA: Optional[float] = None
    vitaminB1: Optional[float] = None
    vitaminB2: Optional[float] = None
    vitaminC: Optional[float] = None
    calcium: Optional[float] = None
    iron: Optional[float] = None
    zinc: Optional[float] = None
    selenium: Optional[float] = None
    folate: Optional[float] = None
    dha: Optional[float] = None # 注意前端用的是小写 dha
    selected: Optional[bool] = None # 前端也传了这个字段

# 营养数据结果模型 (用于 analysis_history)
class NutritionResult(BaseModel):
    energy: float
    protein: float
    fat: float
    carbohydrate: float
    fiber: float
    vitamins: dict # 前端传的是嵌套对象
    calcium: float
    iron: float
    zinc: float
    selenium: float
    folate: float
    DHA: float # 注意前端传的是大写 DHA

# 保存分析历史记录的请求模型
class SaveAnalysisHistoryRequest(BaseModel):
    username: str
    selectedFoods: list[FoodItem] # 食物列表
    nutritionData: NutritionResult # 计算结果

# 注册接口
@app.post("/api/register")
async def register(user: User):
    # 检查用户名是否已经存在
    existing_user = users_collection.find_one({"username": user.username})

    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # 插入数据到 MongoDB
    user_data = {
        "username": user.username,
        "password": user.password,
        "security_question_answer": user.security_question_answer,
        "profile": {}  # 初始化为空的 profile
    }
    result = users_collection.insert_one(user_data)

    if result.acknowledged:
        return {"message": "User registered successfully", "user_id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=400, detail="Error registering user")

# 登录接口
# 登录接口
@app.post("/api/login")
async def login(user: Login):
    # 查询用户是否存在并且密码是否正确
    found_user = users_collection.find_one({"username": user.username, "password": user.password})

    if found_user:
        return {
            "message": "Login successful",
            "username": user.username,
            "profile": found_user.get("profile", {})
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid username or password")

# 找回密码接口
@app.post("/api/recover_password")
async def recover_password(data: PasswordRecovery):
    # 查询用户是否存在并且密保问题答案是否正确
    found_user = users_collection.find_one({
        "username": data.username,
        "security_question_answer": data.security_question_answer
    })

    if found_user:
        # 更新用户密码
        users_collection.update_one(
            {"username": data.username},
            {"$set": {"password": data.new_password}}
        )
        return {"message": "Password updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid username or security question answer")

# 获取用户资料接口
@app.get("/api/get_profile")
async def get_profile(username: str):
    try:
        # 查询用户是否存在
        user = users_collection.find_one({"username": username})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # 返回用户资料
        return {
            "statusCode": 200,
            "profile": user.get("profile", {})  # 如果没有profile，返回空对象
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 更新用户资料接口
@app.post("/api/update_profile")
async def update_profile(data: UpdateProfileRequest):
    try:
        # 检查用户是否存在
        existing_user = users_collection.find_one({"username": data.username})
        
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # 更新用户资料
        update_result = users_collection.update_one(
            {"username": data.username},
            {"$set": {"profile": data.profile.dict()}}  # 更新资料
        )
        
        if update_result.modified_count > 0:
            return {
                "statusCode": 200,
                "message": "Profile updated successfully",
                "data": data.profile.dict()
            }
        else:
            return {
                "statusCode": 200,
                "message": "No changes made to profile",
                "data": existing_user.get("profile", {})
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 保存营养分析历史记录接口
@app.post("/api/save_analysis_history")
async def save_analysis_history(data: SaveAnalysisHistoryRequest):
    try:
        # 检查用户是否存在 (可选，但推荐)
        user = users_collection.find_one({"username": data.username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 准备要存入数据库的数据
        history_record = {
            "username": data.username,
            "date": date.today().isoformat(), # 使用当前日期，格式 YYYY-MM-DD
            "selectedFoods": [food.dict(exclude_unset=True) for food in data.selectedFoods], # 将 Pydantic 模型转为字典列表, 忽略 None 值
            "nutritionData": data.nutritionData.dict() # 将 Pydantic 模型转为字典
        }

        # 插入到 analysis_history 集合
        result = analysis_history_collection.insert_one(history_record)

        if result.acknowledged:
            return {"message": "Analysis history saved successfully", "record_id": str(result.inserted_id)}
        else:
            raise HTTPException(status_code=500, detail="Failed to save analysis history")

    except Exception as e:
        # 打印更详细的错误日志
        print(f"Error saving analysis history: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

# 获取营养分析历史记录接口
@app.get("/api/get_analysis_history")
async def get_analysis_history(username: str): # 从查询参数获取用户名
    try:
        # 检查用户是否存在 (可选)
        user = users_collection.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 查询该用户的所有历史记录，按日期降序排序
        # 使用 .dict() 方法转换 ObjectId 为字符串，以便 JSON 序列化
        history_records = []
        cursor = analysis_history_collection.find(
            {"username": username}
        ).sort("date", -1) # -1 表示降序

        for record in cursor:
            record['_id'] = str(record['_id']) # 转换 ObjectId
            history_records.append(record)

        return {
            "statusCode": 200,
            "message": "Analysis history retrieved successfully",
            "data": history_records
        }

    except Exception as e:
         # 打印更详细的错误日志
        print(f"Error getting analysis history: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

# 网页端 uvicorn main:app --reload
# 手机端 uvicorn main:app --reload --host 0.0.0.0