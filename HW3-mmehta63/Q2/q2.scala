// Databricks notebook source
// MAGIC %md
// MAGIC #### Q2 - Skeleton Scala Notebook
// MAGIC This template Scala Notebook is provided to provide a basic setup for reading in / writing out the graph file and help you get started with Scala.  Clicking 'Run All' above will execute all commands in the notebook and output a file 'toygraph.csv'.  See assignment instructions on how to to retrieve this file. You may modify the notebook below the 'Cmd2' block as necessary.
// MAGIC 
// MAGIC #### Precedence of Instruction
// MAGIC The examples provided herein are intended to be more didactic in nature to get you up to speed w/ Scala.  However, should the HW assignment instructions diverge from the content in this notebook, by incident of revision or otherwise, the HW assignment instructions shall always take precedence.  Do not rely solely on the instructions within this notebook as the final authority of the requisite deliverables prior to submitting this assignment.  Usage of this notebook implicitly guarantees that you understand the risks of using this template code. 

// COMMAND ----------

/*
DO NOT MODIFY THIS BLOCK
This assignment can be completely accomplished with the following includes and case class.
Do not modify the %language prefixes, only use Scala code within this notebook.  The auto-grader will check for instances of <%some-other-lang>, e.g., %python
*/
import org.apache.spark.sql.functions.desc
import org.apache.spark.sql.functions._
case class edges(Source: String, Target: String, Weight: Int)
import spark.implicits._

// COMMAND ----------

/* 
Create an RDD of graph objects from our toygraph.csv file, convert it to a Dataframe
Replace the 'toygraph.csv' below with the name of Q2 graph file.
*/

val df = spark.read.textFile("/FileStore/tables/bitcoinalpha.csv") 
  .map(_.split(","))
  .map(columns => edges(columns(0), columns(1), columns(2).toInt)).toDF()

// COMMAND ----------

// Insert blocks as needed to further process your graph, the division and number of code blocks is at your discretion.

// COMMAND ----------

// e.g. eliminate duplicate rows
val df_u = df.distinct()
// df_u.sort($"Source".asc, $"Target".asc).show()

// COMMAND ----------

// e.g. filter nodes by edge weight >= supplied threshold in assignment instructions
val df_uw = df_u.filter($"Weight" >= 5)
// df_uw.sort($"Source".asc, $"Target".asc).show()

// COMMAND ----------

val df_out = df_uw.select($"Source", $"Target").groupBy($"Source").agg(countDistinct($"Target") as "out-degree").sort($"Source")
val df_in = df_uw.select($"Source", $"Target").groupBy($"Target").agg(countDistinct($"Source") as "in-degree").sort($"Target")

// COMMAND ----------

val df_combined = df_in.join(df_out, $"Target" === $"Source", "outer")
                       .withColumn("node", when($"Target".isNull, $"Source").otherwise($"Target"))
                       .select("node", "out-degree", "in-degree")
                       .na.fill(0)
                       .withColumn("total-degree", $"out-degree" + $"in-degree").sort($"node".asc)
// df_combined.show()

// COMMAND ----------

// find node with highest in-degree, if two or more nodes have the same in-degree, report the one with the lowest node id
val high_in = df_combined.select($"node").sort($"in-degree".desc, $"node".asc).first()(0).toString
// find node with highest out-degree, if two or more nodes have the same out-degree, report the one with the lowest node id
val high_out = df_combined.select($"node").sort($"out-degree".desc, $"node".asc).first()(0).toString
// find node with highest total degree, if two or more nodes have the same total degree, report the one with the lowest node id
val high_total = df_combined.select($"node").sort($"total-degree".desc, $"node".asc).first()(0).toString

// COMMAND ----------

val high_in_d = df_combined.select($"in-degree").sort($"in-degree".desc, $"node".asc).first()(0).toString.toInt
val high_out_d = df_combined.select($"out-degree").sort($"out-degree".desc, $"node".asc).first()(0).toString.toInt
val high_total_d = df_combined.select($"total-degree").sort($"total-degree".desc, $"node".asc).first()(0).toString.toInt

// COMMAND ----------

/*
Create a dataframe to store your results
Schema: 3 columns, named: 'v', 'd', 'c' where:
'v' : vertex id
'd' : degree calculation (an integer value.  one row with highest in-degree, a row w/ highest out-degree, a row w/ highest total degree )
'c' : category of degree, containing one of three string values:
                                                'i' : in-degree
                                                'o' : out-degree                                                
                                                't' : total-degree
- Your output should contain exactly three rows.  
- Your output should contain exactly the column order specified.
- The order of rows does not matter.
                                                
A correct output would be:

v,d,c
2,3,i
1,3,o
2,6,t


whereas:
- Node 1 has highest in-degree with a value of 3
- Node 2 has highest out-degree with a value of 3
- Node 2 has highest total degree with a value of 6
*/

case class Result(v: String, d: Int, c: String)

val row1 = new Result(high_in, high_in_d, "i")
val row2 = new Result(high_out, high_out_d, "o")
val row3 = new Result(high_total, high_total_d, "t")

val df = Seq(row1, row2, row3).toDF()

// COMMAND ----------

display(df)
